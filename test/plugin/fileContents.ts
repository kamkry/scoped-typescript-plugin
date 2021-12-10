export const FILE_CONTENT_WITH_STRICT = `
//@ts-strict
const text: string = null;
`;

export const NULL_ERROR_MESSAGE = "Type 'null' is not assignable to type 'string'.";

export const FILE_CONTENT_WITHOUT_STRICT = `
const text: string = null;
`;

export const FILE_CONTENT_WITH_STRICT_AND_IGNORE = `
//@ts-strict
//@ts-strict-ignore
const text: string = null;
`;

export const FILE_CONTENT_WITH_IGNORE = `
//@ts-strict-ignore
const text: string = null;
`;