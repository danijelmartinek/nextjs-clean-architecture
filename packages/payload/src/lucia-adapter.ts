import type { Adapter, DatabaseSession, DatabaseUser } from 'lucia';

import { getPayloadClient } from './client';

const SESSIONS_COLLECTION = 'sessions';
const USERS_COLLECTION = 'users';

function mapSession(doc: any): DatabaseSession {
  return {
    id: doc.sessionId,
    userId: doc.userId,
    expiresAt: new Date(doc.expiresAt),
    attributes: doc.attributes ?? {},
  };
}

function mapUser(doc: any): DatabaseUser {
  return {
    id: doc.appUserId,
    attributes: {
      username: doc.username,
    },
  };
}

async function findSessionDocument(sessionId: string) {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: SESSIONS_COLLECTION,
    where: {
      sessionId: {
        equals: sessionId,
      },
    },
    limit: 1,
  });

  return result.docs[0] ?? null;
}

async function findUserDocument(userId: string) {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: USERS_COLLECTION,
    where: {
      appUserId: {
        equals: userId,
      },
    },
    limit: 1,
  });

  return result.docs[0] ?? null;
}

export function createPayloadLuciaAdapter(): Adapter {
  return {
    async getSessionAndUser(sessionId) {
      const sessionDoc = await findSessionDocument(sessionId);

      if (!sessionDoc) {
        return [null, null];
      }

      const userDoc = await findUserDocument(sessionDoc.userId);

      if (!userDoc) {
        return [mapSession(sessionDoc), null];
      }

      return [mapSession(sessionDoc), mapUser(userDoc)];
    },

    async getUserSessions(userId) {
      const payload = await getPayloadClient();
      const result = await payload.find({
        collection: SESSIONS_COLLECTION,
        where: {
          userId: {
            equals: userId,
          },
        },
      });

      return result.docs.map(mapSession);
    },

    async setSession(session) {
      const existing = await findSessionDocument(session.id);
      const payload = await getPayloadClient();

      if (existing) {
        await payload.update({
          collection: SESSIONS_COLLECTION,
          id: existing.id,
          data: {
            sessionId: session.id,
            userId: session.userId,
            expiresAt: session.expiresAt,
            attributes: session.attributes ?? {},
          },
        });
      } else {
        await payload.create({
          collection: SESSIONS_COLLECTION,
          data: {
            sessionId: session.id,
            userId: session.userId,
            expiresAt: session.expiresAt,
            attributes: session.attributes ?? {},
          },
        });
      }
    },

    async updateSessionExpiration(sessionId, expiresAt) {
      const sessionDoc = await findSessionDocument(sessionId);

      if (!sessionDoc) {
        return;
      }

      const payload = await getPayloadClient();
      await payload.update({
        collection: SESSIONS_COLLECTION,
        id: sessionDoc.id,
        data: {
          ...sessionDoc,
          expiresAt,
        },
      });
    },

    async deleteSession(sessionId) {
      const sessionDoc = await findSessionDocument(sessionId);

      if (!sessionDoc) {
        return;
      }

      const payload = await getPayloadClient();
      await payload.delete({
        collection: SESSIONS_COLLECTION,
        id: sessionDoc.id,
      });
    },

    async deleteUserSessions(userId) {
      const payload = await getPayloadClient();
      const result = await payload.find({
        collection: SESSIONS_COLLECTION,
        where: {
          userId: {
            equals: userId,
          },
        },
      });

      await Promise.all(
        result.docs.map((doc) =>
          payload.delete({
            collection: SESSIONS_COLLECTION,
            id: doc.id,
          })
        )
      );
    },

    async deleteExpiredSessions() {
      const payload = await getPayloadClient();
      const result = await payload.find({
        collection: SESSIONS_COLLECTION,
        where: {
          expiresAt: {
            less_than: new Date().toISOString(),
          },
        },
      });

      await Promise.all(
        result.docs.map((doc) =>
          payload.delete({
            collection: SESSIONS_COLLECTION,
            id: doc.id,
          })
        )
      );
    },
  };
}
