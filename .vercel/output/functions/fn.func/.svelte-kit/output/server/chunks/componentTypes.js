import { nanoid } from "nanoid";
const internalErrorCode = {
  http: 500,
  trpc: "INTERNAL_SERVER_ERROR",
  prisma: []
};
const getErrorCode = ({ http, trpc, prisma: prisma2 }) => {
  if (http)
    return errorCodes.find((ec) => ec.http == http) ?? internalErrorCode;
  if (trpc)
    return errorCodes.find((ec) => ec.trpc == trpc) ?? internalErrorCode;
  if (prisma2)
    return errorCodes.find((ec) => ec.prisma.includes(prisma2)) ?? internalErrorCode;
  return internalErrorCode;
};
const errorCodes = [
  {
    http: 400,
    trpc: "BAD_REQUEST",
    prisma: ["P2003"]
  },
  {
    http: 401,
    trpc: "UNAUTHORIZED",
    prisma: []
  },
  {
    http: 403,
    trpc: "FORBIDDEN",
    prisma: []
  },
  {
    http: 404,
    trpc: "NOT_FOUND",
    prisma: ["P2025"]
  },
  {
    http: 404,
    trpc: "METHOD_NOT_SUPPORTED",
    prisma: []
  },
  {
    http: 408,
    trpc: "TIMEOUT",
    prisma: []
  },
  {
    http: 409,
    trpc: "CONFLICT",
    prisma: ["P2002"]
  },
  {
    http: 412,
    trpc: "PRECONDITION_FAILED",
    prisma: []
  },
  {
    http: 413,
    trpc: "PAYLOAD_TOO_LARGE",
    prisma: []
  },
  {
    http: 422,
    trpc: "UNPROCESSABLE_CONTENT",
    prisma: []
  },
  {
    http: 429,
    trpc: "TOO_MANY_REQUESTS",
    prisma: []
  },
  {
    http: 499,
    trpc: "CLIENT_CLOSED_REQUEST",
    prisma: []
  },
  {
    http: 500,
    trpc: "INTERNAL_SERVER_ERROR",
    prisma: []
  }
];
const defaultNewComponent = {
  id: nanoid(),
  name: "",
  properties: {
    id: nanoid(),
    x: 500,
    y: 0,
    width: 200,
    height: 200,
    padding: 16,
    opacity: 100,
    bgColor: "bg-base-100",
    textColor: "text-base-content",
    shadow: "shadow-none",
    rounded: "rounded-2xl",
    border: true,
    outline: false
  }
};
const getLabels = (key) => {
  const Key = `${key[0].toUpperCase() + key.slice(1)}`;
  return {
    key,
    Key,
    keyComponent: `${key}Component`,
    keyComponents: `${key}Components`,
    upsertKeyComponent: `upsert${Key}Component`
  };
};
const prismaDeleteComponents = async (reportId, prismaTable, components) => {
  const existingComponents = await prismaTable.findMany({
    where: { reportId },
    select: { id: true }
  });
  const deleteComponents = existingComponents.filter((ec) => !components.find((c) => ec.id === c.id)).map((d) => d.id);
  await prismaTable.deleteMany({ where: { id: { in: deleteComponents } } });
};
const prismaUpsertComponents = async (reportId, prismaTable, components) => {
  for (const { id, properties, ...values } of components) {
    const propertiesId = await prismaUpsertProperties(properties);
    await prismaTable.upsert({
      where: { id },
      create: {
        reportId,
        propertiesId,
        ...values
      },
      update: { ...values }
    });
  }
};
const prismaUpsertProperties = async (properties) => {
  const { id, ...values } = properties;
  return (await prisma.componentProperties.upsert({
    where: { id },
    create: values,
    update: values,
    select: { id: true }
  })).id;
};
const createComponentType = (key) => {
  if (key === "input")
    return {
      labels: getLabels(key),
      client: {
        icon: "mdi:card-text",
        newComponent: {
          ...defaultNewComponent,
          queryParamId: void 0,
          label: "",
          type: "text"
        },
        getTableValues: ({ id, name, label, type, properties }) => ({
          key,
          id,
          datasetId: void 0,
          name,
          properties,
          values: { Label: label, Type: type }
        })
      },
      server: {}
    };
  else if (key === "button")
    return {
      labels: getLabels(key),
      client: {
        icon: "mdi:card-text",
        newComponent: {
          ...defaultNewComponent,
          datasetId: void 0,
          type: "",
          text: ""
        },
        getTableValues: ({ id, datasetId, name, type, text, properties }) => ({
          key,
          id,
          datasetId,
          name,
          properties,
          values: { Type: type, Text: text }
        })
      },
      server: {}
    };
  else if (key === "card")
    return {
      labels: getLabels(key),
      client: {
        icon: "mdi:card-text",
        newComponent: {
          ...defaultNewComponent,
          datasetId: void 0,
          label: "",
          column: "",
          rowNumber: 1
        },
        getTableValues: ({ id, datasetId, name, label, column, rowNumber, properties }) => ({
          key,
          id,
          datasetId,
          name,
          properties,
          values: { Label: label, Column: column, ["Row Number"]: rowNumber.toString() }
        })
      },
      server: {}
    };
  else
    return {
      labels: getLabels(key),
      client: {
        icon: "mdi:table",
        newComponent: {
          ...defaultNewComponent,
          datasetId: void 0,
          label: "",
          columns: "",
          rows: "",
          searching: true,
          sorting: true,
          paging: true,
          info: true
        },
        getTableValues: ({ id, datasetId, name, label, columns, rows, properties }) => ({
          key,
          id,
          datasetId,
          name,
          properties,
          values: { Label: label, Columns: columns, ["Rows"]: rows }
        })
      },
      server: {}
    };
};
const componentTypes = {
  input: createComponentType("input"),
  button: createComponentType("button"),
  card: createComponentType("card"),
  table: createComponentType("table")
};
const componentTypesList = Object.values(componentTypes);
const componentIncludes = Object.fromEntries(
  componentTypesList.map((ct) => [ct.labels.keyComponents, { include: { properties: true } }])
);
const getComponentClass = (view, { bgColor, textColor, shadow, rounded, border, outline }) => `absolute flex flex-col justify-center items-center overflow-auto
   ${bgColor} ${textColor} ${shadow} ${rounded}
   ${border && "border"} ${outline && "outline"} 
   ${!view && "hover:outline hover:outline-1 hover:outline-blue-300 active:outline-blue-700"}`;
export {
  componentTypes as a,
  getErrorCode as b,
  componentTypesList as c,
  componentIncludes as d,
  prismaUpsertComponents as e,
  getComponentClass as g,
  prismaDeleteComponents as p
};
