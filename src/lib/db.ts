import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Database {
  // User Operations
  static async createUser(email: string, name?: string) {
    return prisma.user.create({
      data: {
        email,
        name,
      },
    });
  }

  static async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        phoneNumbers: true,
        emails: true,
      },
    });
  }

  // Phone Number Operations
  static async assignPhoneNumber(userId: string, phoneNumber: string, type: 'telemarketing' | 'sms') {
    return prisma.userPhoneNumber.create({
      data: {
        userId,
        phoneNumber,
        type,
      },
    });
  }

  static async getUserPhoneNumbers(userId: string) {
    return prisma.userPhoneNumber.findMany({
      where: { userId },
    });
  }

  // Email Operations
  static async assignEmail(userId: string, email: string) {
    return prisma.userEmail.create({
      data: {
        userId,
        email,
      },
    });
  }

  // Campaign Operations
  static async createCampaign(userId: string, type: string, name: string) {
    return prisma.campaign.create({
      data: {
        userId,
        type,
        name,
        status: 'draft',
      },
    });
  }

  static async getCampaigns(userId: string) {
    return prisma.campaign.findMany({
      where: { userId },
      include: {
        contacts: true,
        messages: true,
      },
    });
  }

  // Contact Operations
  static async addContact(userId: string, data: {
    name?: string;
    phoneNumber?: string;
    email?: string;
    campaignId?: string;
  }) {
    return prisma.contact.create({
      data: {
        userId,
        ...data,
        status: 'active',
      },
    });
  }

  static async addContacts(userId: string, contacts: Array<{
    name?: string;
    phoneNumber?: string;
    email?: string;
    campaignId?: string;
  }>) {
    return prisma.contact.createMany({
      data: contacts.map(contact => ({
        userId,
        ...contact,
        status: 'active',
      })),
    });
  }

  static async getContacts(userId: string, campaignId?: string) {
    return prisma.contact.findMany({
      where: {
        userId,
        ...(campaignId ? { campaignId } : {}),
      },
    });
  }

  // Message Operations
  static async createMessage(campaignId: string, content: string, type: string) {
    return prisma.message.create({
      data: {
        campaignId,
        content,
        type,
        status: 'pending',
      },
    });
  }

  static async updateMessageStatus(messageId: string, status: string) {
    return prisma.message.update({
      where: { id: messageId },
      data: { status },
    });
  }

  static async getCampaignMessages(campaignId: string) {
    return prisma.message.findMany({
      where: { campaignId },
    });
  }
}

export default prisma; 