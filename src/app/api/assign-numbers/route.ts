import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import models from '@/models';
import twilio from 'twilio';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

interface UserInstance {
  id: string;
  email: string;
  name?: string;
}

interface PhoneNumberInstance {
  id: string;
  userId: string;
  phoneNumber: string;
  type: 'telemarketing' | 'sms';
}

interface EmailInstance {
  id: string;
  userId: string;
  email: string;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await models.User.findOne({
      where: { email: session.user.email },
    }) as UserInstance | null;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user already has numbers assigned
    const existingNumbers = await models.UserPhoneNumber.findAll({
      where: { userId: user.id },
    }) as unknown as PhoneNumberInstance[];

    if (existingNumbers.length === 0) {
      // Purchase new phone numbers from Twilio
      const [telemarketingNumber, smsNumber] = await Promise.all([
        twilioClient.incomingPhoneNumbers.create({
          phoneNumber: process.env.TWILIO_PHONE_NUMBER_POOL_TELEMARKETING,
        }),
        twilioClient.incomingPhoneNumbers.create({
          phoneNumber: process.env.TWILIO_PHONE_NUMBER_POOL_SMS,
        }),
      ]);

      // Create user phone numbers
      await models.UserPhoneNumber.bulkCreate([
        {
          userId: user.id,
          phoneNumber: telemarketingNumber.phoneNumber,
          type: 'telemarketing',
        },
        {
          userId: user.id,
          phoneNumber: smsNumber.phoneNumber,
          type: 'sms',
        },
      ]);
    }

    // Check if user already has an email assigned
    const existingEmail = await models.UserEmail.findOne({
      where: { userId: user.id },
    }) as EmailInstance | null;

    if (!existingEmail) {
      // Generate a unique email address
      const emailPrefix = user.email.split('@')[0];
      const uniqueEmail = `${emailPrefix}+${Date.now()}@${process.env.EMAIL_DOMAIN}`;

      // Create user email
      await models.UserEmail.create({
        userId: user.id,
        email: uniqueEmail,
      });
    }

    // Return the assigned numbers and email
    const userNumbers = await models.UserPhoneNumber.findAll({
      where: { userId: user.id },
    }) as unknown as PhoneNumberInstance[];

    const userEmail = await models.UserEmail.findOne({
      where: { userId: user.id },
    }) as EmailInstance | null;

    return NextResponse.json({
      telemarketingNumber: userNumbers.find(n => n.type === 'telemarketing')?.phoneNumber,
      smsNumber: userNumbers.find(n => n.type === 'sms')?.phoneNumber,
      email: userEmail?.email,
    });
  } catch (error) {
    console.error('Error assigning numbers:', error);
    return NextResponse.json(
      { error: 'Failed to assign numbers' },
      { status: 500 }
    );
  }
} 