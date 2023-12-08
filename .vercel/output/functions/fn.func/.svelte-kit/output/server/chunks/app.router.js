import * as trpc from "@trpc/server";
import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { b as getErrorCode, d as componentIncludes, c as componentTypesList, p as prismaDeleteComponents, e as prismaUpsertComponents } from "./componentTypes.js";
import knex from "knex";
import { u as upsertReportSchema } from "./reportSchema.js";
async function createContext({ locals: { session } }) {
  return { session };
}
const t = initTRPC.context().create();
const { router, procedure, middleware } = t;
const isAuth = middleware(({ ctx: { session }, next }) => {
  if (!session)
    throw new TRPCError({ code: "FORBIDDEN" });
  return next({ ctx: { session } });
});
const authProcedure = procedure.use(isAuth);
const upsertApiKeySchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1)
});
const apiKeyRouter = router({
  getAll: authProcedure.query(async ({ ctx: { session } }) => {
    const apiKeys = await prisma.aPIKey.findMany({
      where: { userId: session.user_id }
    });
    return { apiKeys };
  }),
  upsert: authProcedure.input(upsertApiKeySchema).query(async ({ ctx: { session }, input: { id, name } }) => {
    const apiKey = await prisma.aPIKey.upsert({
      where: { id: id ?? "" },
      create: {
        name,
        userId: session.user_id
      },
      update: { name }
    });
    return { apiKey };
  }),
  delete: authProcedure.input(z.object({ id: z.string().min(1) })).query(async ({ input: { id } }) => {
    await prisma.aPIKey.delete({ where: { id } });
    return { id };
  })
});
const prismaErrorHandler = (e) => {
  console.log(e);
  if (e instanceof Prisma.PrismaClientKnownRequestError)
    throw new trpc.TRPCError({
      code: getErrorCode({ prisma: e.code })?.trpc ?? "INTERNAL_SERVER_ERROR",
      message: `Database Error ${e.code}: ${e.message}`
    });
  throw new trpc.TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: `Database Error`
  });
};
const testDBConnection = async (provider, connectionString, connectionOption) => {
  try {
    let db;
    if (connectionString)
      db = knex({ client: provider, connection: connectionString });
    else if (connectionOption) {
      db = knex({
        client: provider,
        connection: {
          ...connectionOption,
          userName: connectionOption.username,
          database: connectionOption.databaseName
        }
      });
    } else
      throw "Invalid Connection Type";
    await db.raw("SELECT 1 as test");
    await db.destroy();
    return { success: true };
  } catch (error) {
    throw new TRPCError({ code: "BAD_REQUEST", message: String(error) });
  }
};
const queryDB = async (provider, connectionString, connectionOption, query) => {
  try {
    let db;
    if (connectionString)
      db = knex({ client: provider, connection: connectionString });
    else if (connectionOption) {
      db = knex({
        client: provider,
        connection: {
          ...connectionOption,
          userName: connectionOption.username,
          database: connectionOption.databaseName
        }
      });
    } else
      throw "Invalid Connection Type";
    const data = await db.raw(query);
    await db.destroy();
    return { data };
  } catch (error) {
    throw new TRPCError({ code: "BAD_REQUEST", message: String(error) });
  }
};
const upsertDatabaseSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  provider: z.string().min(1),
  connectionType: z.string().min(1),
  connectionString: z.string().min(1).optional(),
  connectionOption: z.object({
    host: z.string().min(1),
    port: z.number(),
    databaseName: z.string().min(1),
    username: z.string().min(1),
    password: z.string().min(1)
  }).optional()
});
const databaseRouter = router({
  getAll: authProcedure.query(async ({ ctx: { session } }) => {
    const databases = await prisma.database.findMany({
      where: { userId: session.user_id },
      include: { connectionOption: true }
    });
    return { databases };
  }),
  upsert: authProcedure.input(upsertDatabaseSchema).query(
    async ({
      ctx: { session },
      input: { id, name, provider, connectionType, connectionString, connectionOption }
    }) => {
      await testDBConnection(provider, connectionString, connectionOption);
      const dbConnectionOption = await prisma.connectionOption.findUnique({
        where: { databaseId: id ?? "" },
        select: { id: true }
      });
      const database = await prisma.database.upsert({
        where: { id: id ?? "" },
        create: {
          userId: session.user_id,
          name,
          provider,
          connectionType,
          connectionString,
          connectionOption: connectionOption ? { create: { ...connectionOption } } : void 0
        },
        update: {
          name,
          provider,
          connectionType,
          connectionString: connectionString ?? null,
          connectionOption: connectionOption ? dbConnectionOption ? { update: { ...connectionOption } } : { create: { ...connectionOption } } : dbConnectionOption ? { delete: true } : void 0
        }
      }).catch(prismaErrorHandler);
      return { database };
    }
  ),
  delete: authProcedure.input(
    z.object({
      id: z.string().min(1)
    })
  ).query(async ({ input: { id } }) => {
    await prisma.database.delete({ where: { id } });
    return { id };
  }),
  testConnection: authProcedure.input(
    z.object({
      id: z.string().min(1)
    })
  ).query(async ({ input: { id } }) => {
    const { provider, connectionString, connectionOption } = await prisma.database.findUniqueOrThrow({
      where: { id },
      select: {
        provider: true,
        connectionString: true,
        connectionOption: true
      }
    }).catch(prismaErrorHandler);
    return await testDBConnection(provider, connectionString, connectionOption);
  }),
  queryData: procedure.input(
    z.object({
      id: z.string().min(1),
      query: z.string().min(1)
    })
  ).query(async ({ input: { id, query } }) => {
    const { provider, connectionString, connectionOption } = await prisma.database.findUniqueOrThrow({
      where: { id },
      select: {
        provider: true,
        connectionString: true,
        connectionOption: true
      }
    }).catch(prismaErrorHandler);
    return await queryDB(provider, connectionString, connectionOption, query);
  })
});
const reportRouter = router({
  getAll: authProcedure.query(async ({ ctx: { session } }) => {
    const reports = await prisma.report.findMany({
      where: { userId: session.user_id },
      include: { _count: true }
    });
    return { reports };
  }),
  getById: authProcedure.input(z.object({ id: z.string().min(1) })).query(async ({ ctx: { session }, input: { id } }) => {
    const apiKey = (await prisma.aPIKey.findFirst({ select: { id: true } }))?.id;
    const report = await prisma.report.findUniqueOrThrow({
      where: { id, userId: session.user_id },
      include: {
        datasets: { include: { queryParams: true } },
        ...componentIncludes
      }
    }).catch(prismaErrorHandler);
    return { apiKey, report };
  }),
  save: authProcedure.input(upsertReportSchema).query(
    async ({
      ctx: { session },
      input: {
        id,
        datasets,
        name,
        description,
        canvasHeight,
        theme,
        ...allComponents
      }
    }) => {
      const reportId = (await prisma.report.upsert({
        where: { id },
        create: { userId: session.user_id, name, description, canvasHeight, theme },
        update: { name, description, canvasHeight, theme },
        select: { id: true }
      })).id;
      const existingDatasets = await prisma.dataset.findMany({
        where: { reportId },
        select: { id: true }
      });
      const deleteDatasetsId = existingDatasets.filter((ed) => !datasets.find((d) => ed.id === d.id)).map((d) => d.id);
      await prisma.dataset.deleteMany({ where: { id: { in: deleteDatasetsId } } });
      for (const { id: id2, queryParams, ...values } of datasets) {
        const datasetId = (await prisma.dataset.upsert({
          where: { id: id2 },
          create: { reportId, ...values },
          update: { ...values },
          select: { id: true }
        })).id;
        const existingQueryParams = await prisma.queryParam.findMany({
          where: { datasetId },
          select: { id: true }
        });
        const deleteQueryParams = existingQueryParams.filter((ecc) => !queryParams.find((cc) => ecc.id === cc.id)).map((d) => d.id);
        await prisma.queryParam.deleteMany({ where: { id: { in: deleteQueryParams } } });
        for (const { id: id3, ...values2 } of queryParams) {
          await prisma.queryParam.upsert({
            where: { id: id3 },
            create: { datasetId, ...values2 },
            update: { ...values2 }
          });
        }
      }
      for (const {
        labels: { key, keyComponent, keyComponents },
        server: { deleteFn, upsertFn }
      } of componentTypesList) {
        if (deleteFn)
          await deleteFn(reportId, session.user_id, allComponents[keyComponents]);
        else
          await prismaDeleteComponents(reportId, prisma[keyComponent], allComponents[keyComponents]);
        if (upsertFn)
          await upsertFn(reportId, session.user_id, allComponents[keyComponents]);
        else
          await prismaUpsertComponents(reportId, prisma[keyComponent], allComponents[keyComponents]);
      }
      return { reportId };
    }
  ),
  getReportView: procedure.input(z.object({ id: z.string().min(1), token: z.string().min(1) })).query(async ({ input: { id, token } }) => {
    const report = await prisma.report.findUniqueOrThrow({
      where: { id },
      include: {
        datasets: { include: { queryParams: true } },
        ...componentIncludes
      }
    }).catch(prismaErrorHandler);
    const { validateTokenUrl } = await prisma.user.findUniqueOrThrow({
      where: { id: report.userId },
      select: { validateTokenUrl: true }
    }).catch(prismaErrorHandler);
    const res = await fetch(validateTokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        AccessKey: "52CB3A03-1F50-41E5-9A24-BD8843B4403A",
        Token: token
      })
    });
    const { Message, ...queryParams } = await res.json();
    if (res.status !== 200)
      throw new TRPCError({
        code: getErrorCode({ http: res.status }).trpc,
        message: Message
      });
    report.datasets.forEach(
      (d, di) => d.queryParams.forEach((q, qi) => {
        const i = Object.keys(queryParams).findIndex((k) => k === q.key);
        if (i > 1)
          report.datasets[di].queryParams[qi].value = String(Object.values(queryParams)[i]);
      })
    );
    return { report };
  })
});
const userRouter = router({
  updateTheme: authProcedure.input(z.object({ theme: z.string().min(1) })).query(async ({ ctx: { session }, input: { theme } }) => {
    await prisma.user.update({
      where: { id: session.user_id },
      data: { theme }
    });
    return { theme };
  }),
  getValidateTokenURL: authProcedure.query(async ({ ctx: { session } }) => {
    const { validateTokenUrl } = await prisma.user.findUniqueOrThrow({
      where: { id: session.user_id },
      select: { validateTokenUrl: true }
    });
    return { validateTokenUrl };
  }),
  updateValidateTokenURL: authProcedure.input(z.object({ validateTokenUrl: z.string().min(1) })).query(async ({ ctx: { session }, input: { validateTokenUrl } }) => {
    await prisma.user.update({
      where: { id: session.user_id },
      data: { validateTokenUrl }
    });
    return { validateTokenUrl };
  })
});
const appRouter = router({
  test: procedure.query(async () => {
    return "hello";
  }),
  user: userRouter,
  database: databaseRouter,
  apiKey: apiKeyRouter,
  report: reportRouter
});
const createCaller = async (event) => appRouter.createCaller(await createContext(event));
export {
  appRouter as a,
  createContext as b,
  createCaller as c
};
