// To parse this data:
//
//   import { Convert, APILoginProps } from "./file";
//
//   const aPILoginProps = Convert.toAPILoginProps(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface ApiLoginProps {
  success: boolean;
  data: Data;
  message?: string;
}

export interface Data {
  user: User;
  access_token: Token;
  refresh_token: Token;
}

export interface Token {
  expires_in: number;
  token: string;
}

export interface User {
  name: string;
  collections: Collection[];
  username: string;
}

export interface Collection {
  name: string;
  _id: string;
  images: Image[];
}

export interface Image {
  id: number;
  owner: string;
  rating: Rating;
  tags: PurpleTag[] | TagsClass | string;
  tags_length?: number;
  source: null | string;
  file_url: string;
  sample_url: string;
  preview_url: string;
  type_file: TypeFile;
  height: number;
  width: number;
  sample_height: number;
  sample_width: number;
  extension: Extension;
  tags_count?: number;
}

export enum Extension {
  Gelbooru = "gelbooru",
  Realbooru = "realbooru",
  Rule34 = "rule34",
  Safebooru = "safebooru",
}

export enum Rating {
  Explicit = "explicit",
  General = "general",
  Questionable = "questionable",
  Safe = "safe",
  Sensitive = "sensitive",
}

export interface PurpleTag {
  id: number | null;
  name: string;
  count: number | null;
  type: number;
  ambiguous?: number | null;
  ambigouis?: null;
  type_failed?: boolean;
}

export interface TagsClass {
  tags: FluffyTag[];
  count?: number;
  tags_count?: number;
}

export interface FluffyTag {
  id: string;
  name: string;
  count: string;
  type: string;
  ambiguous: string;
}

export enum TypeFile {
  GIF = "gif",
  JPEG = "jpeg",
  Jpg = "jpg",
  Mp4 = "mp4",
  PNG = "png",
  Webm = "webm",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toAPILoginProps(json: string): ApiLoginProps {
    return cast(JSON.parse(json), r("APILoginProps"));
  }

  public static aPILoginPropsToJson(value: ApiLoginProps): string {
    return JSON.stringify(uncast(value, r("APILoginProps")), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ""): never {
  const prettyTyp = prettyTypeName(typ);
  const parentText = parent ? ` on ${parent}` : "";
  const keyText = key ? ` for key "${key}"` : "";
  throw Error(
    `Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(
      val
    )}`
  );
}

function prettyTypeName(typ: any): string {
  if (Array.isArray(typ)) {
    if (typ.length === 2 && typ[0] === undefined) {
      return `an optional ${prettyTypeName(typ[1])}`;
    } else {
      return `one of [${typ
        .map((a) => {
          return prettyTypeName(a);
        })
        .join(", ")}]`;
    }
  } else if (typeof typ === "object" && typ.literal !== undefined) {
    return typ.literal;
  } else {
    return typeof typ;
  }
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(
  val: any,
  typ: any,
  getProps: any,
  key: any = "",
  parent: any = ""
): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key, parent);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val, key, parent);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(
      cases.map((a) => {
        return l(a);
      }),
      val,
      key,
      parent
    );
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue(l("Date"), val, key, parent);
    }
    return d;
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any
  ): any {
    if (val === null || typeof val !== "object" || Array.isArray(val)) {
      return invalidValue(l(ref || "object"), val, key, parent);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, key, ref);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key, ref);
      }
    });
    return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val, key, parent);
  }
  if (typ === false) return invalidValue(typ, val, key, parent);
  let ref: any = undefined;
  while (typeof typ === "object" && typ.ref !== undefined) {
    ref = typ.ref;
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers")
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty("arrayItems")
      ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty("props")
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val, key, parent);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
  return { literal: typ };
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  APILoginProps: o(
    [
      { json: "success", js: "success", typ: true },
      { json: "data", js: "data", typ: r("Data") },
    ],
    false
  ),
  Data: o(
    [
      { json: "user", js: "user", typ: r("User") },
      { json: "access_token", js: "access_token", typ: r("Token") },
      { json: "refresh_token", js: "refresh_token", typ: r("Token") },
    ],
    false
  ),
  Token: o(
    [
      { json: "expires_in", js: "expires_in", typ: 0 },
      { json: "token", js: "token", typ: "" },
    ],
    false
  ),
  User: o(
    [
      { json: "name", js: "name", typ: "" },
      { json: "collection", js: "collection", typ: a(r("Collection")) },
      { json: "username", js: "username", typ: "" },
    ],
    false
  ),
  Collection: o(
    [
      { json: "name", js: "name", typ: "" },
      { json: "_id", js: "_id", typ: "" },
      { json: "images", js: "images", typ: a(r("Image")) },
    ],
    false
  ),
  Image: o(
    [
      { json: "id", js: "id", typ: 0 },
      { json: "owner", js: "owner", typ: "" },
      { json: "rating", js: "rating", typ: r("Rating") },
      {
        json: "tags",
        js: "tags",
        typ: u(a(r("PurpleTag")), r("TagsClass"), ""),
      },
      { json: "tags_length", js: "tags_length", typ: u(undefined, 0) },
      { json: "source", js: "source", typ: u(null, "") },
      { json: "file_url", js: "file_url", typ: "" },
      { json: "sample_url", js: "sample_url", typ: "" },
      { json: "preview_url", js: "preview_url", typ: "" },
      { json: "type_file", js: "type_file", typ: r("TypeFile") },
      { json: "height", js: "height", typ: 0 },
      { json: "width", js: "width", typ: 0 },
      { json: "sample_height", js: "sample_height", typ: 0 },
      { json: "sample_width", js: "sample_width", typ: 0 },
      { json: "extension", js: "extension", typ: r("Extension") },
      { json: "tags_count", js: "tags_count", typ: u(undefined, 0) },
    ],
    false
  ),
  PurpleTag: o(
    [
      { json: "id", js: "id", typ: u(0, null) },
      { json: "name", js: "name", typ: "" },
      { json: "count", js: "count", typ: u(0, null) },
      { json: "type", js: "type", typ: 0 },
      { json: "ambiguous", js: "ambiguous", typ: u(undefined, u(0, null)) },
      { json: "ambigouis", js: "ambigouis", typ: u(undefined, null) },
      { json: "type_failed", js: "type_failed", typ: u(undefined, true) },
    ],
    false
  ),
  TagsClass: o(
    [
      { json: "tags", js: "tags", typ: a(r("FluffyTag")) },
      { json: "count", js: "count", typ: u(undefined, 0) },
      { json: "tags_count", js: "tags_count", typ: u(undefined, 0) },
    ],
    false
  ),
  FluffyTag: o(
    [
      { json: "id", js: "id", typ: "" },
      { json: "name", js: "name", typ: "" },
      { json: "count", js: "count", typ: "" },
      { json: "type", js: "type", typ: "" },
      { json: "ambiguous", js: "ambiguous", typ: "" },
    ],
    false
  ),
  Extension: ["gelbooru", "realbooru", "rule34", "safebooru"],
  Rating: ["explicit", "general", "questionable", "safe", "sensitive"],
  TypeFile: ["gif", "jpeg", "jpg", "mp4", "png", "webm"],
};
