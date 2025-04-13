import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Session } from 'next-auth';

interface ExtendedSession extends Session {
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  };
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

const plans = {
  basic: {
    priceId: process.env.STRIPE_BASIC_PRICE_ID!,
    name: 'Basic Plan',
  },
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    name: 'Pro Plan',
  },
  enterprise: {
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
    name: 'Enterprise Plan',
  },
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession;
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId } = await req.json();
    const plan = plans[planId as keyof typeof plans];

    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email,
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment?canceled=true`,
      metadata: {
        userId: session.user.id,
        planId,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error creating subscription' },
      { status: 500 }
    );
  }
} 