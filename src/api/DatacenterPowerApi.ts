export interface DsDatacenterDeviceCardSerializer {
    heat_dissipation_btu?: number;
    id?: number;
    image_url?: string;
    is_creator?: number;
    likes_count?: number;
    name?: string;
    power_consumption_w?: number;
    short_description?: string;
    video_url?: string;
}
export interface DsDatacenterDeviceLikeRequest {
    like: 0 | 1;
}
export interface DsDatacenterDevicePublishRequest {
    heat_dissipation_btu: number;
    name: string;
    power_consumption_w: number;
    short_description: string;
}
export interface DsDatacenterDeviceReelSerializer {
    heat_dissipation_btu?: number;
    id?: number;
    image_url?: string;
    is_creator?: number;
    is_liked?: number;
    likes_count?: number;
    name?: string;
    power_consumption_w?: number;
    short_description?: string;
    video_url?: string;
}
export interface DsDatacenterDeviceSerializer {
    heat_dissipation_btu?: number;
    id?: number;
    image_url?: string;
    likes_count?: number;
    name?: string;
    power_consumption_w?: number;
    short_description?: string;
    video_url?: string;
}
export interface DsDatacenterEngineer {
    id?: number;
    is_moderator?: boolean;
    login?: string;
}
export interface DsDatacenterEngineerSignInRequest {
    login: string;
    password: string;
}
export interface DsDatacenterEngineerSignInResponse {
    access_token?: string;
    expires_in?: number;
    token_type?: string;
}
export interface DsDatacenterEngineerSignUpRequest {
    login: string;
    password: string;
}
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType, } from "axios";
import axios from "axios";
export type QueryParamsType = Record<string | number, any>;
export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
    secure?: boolean;
    path: string;
    type?: ContentType;
    query?: QueryParamsType;
    format?: ResponseType;
    body?: unknown;
}
export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;
export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
    securityWorker?: (securityData: SecurityDataType | null) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
    secure?: boolean;
    format?: ResponseType;
}
export type ContentType = "application/json" | "application/vnd.api+json" | "multipart/form-data" | "application/x-www-form-urlencoded" | "text/plain";
export class HttpClient<SecurityDataType = unknown> {
    public instance: AxiosInstance;
    private securityData: SecurityDataType | null = null;
    private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
    private secure?: boolean;
    private format?: ResponseType;
    constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
        this.instance = axios.create({
            ...axiosConfig,
            baseURL: axiosConfig.baseURL || "http://localhost:8080/api",
        });
        this.secure = secure;
        this.format = format;
        this.securityWorker = securityWorker;
    }
    public setSecurityData = (data: SecurityDataType | null) => {
        this.securityData = data;
    };
    protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
        const method = params1.method || (params2 && params2.method);
        return {
            ...this.instance.defaults,
            ...params1,
            ...(params2 || {}),
            headers: {
                ...((method &&
                    this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) ||
                    {}),
                ...(params1.headers || {}),
                ...((params2 && params2.headers) || {}),
            },
        };
    }
    protected stringifyFormItem(formItem: unknown) {
        if (typeof formItem === "object" && formItem !== null) {
            return JSON.stringify(formItem);
        }
        else {
            return `${formItem}`;
        }
    }
    protected createFormData(input: Record<string, unknown>): FormData {
        if (input instanceof FormData) {
            return input;
        }
        return Object.keys(input || {}).reduce((formData, key) => {
            const property = input[key];
            const propertyContent: any[] = property instanceof Array ? property : [property];
            for (const formItem of propertyContent) {
                const isFileType = formItem instanceof Blob || formItem instanceof File;
                formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
            }
            return formData;
        }, new FormData());
    }
    public request = async <T = any, _E = any>({ secure, path, type, query, format, body, ...params }: FullRequestParams): Promise<AxiosResponse<T>> => {
        const secureParams = ((typeof secure === "boolean" ? secure : this.secure) &&
            this.securityWorker &&
            (await this.securityWorker(this.securityData))) ||
            {};
        const requestParams = this.mergeRequestParams(params, secureParams);
        const responseFormat = format || this.format || undefined;
        if (type === "multipart/form-data" &&
            body &&
            body !== null &&
            typeof body === "object") {
            body = this.createFormData(body as Record<string, unknown>);
        }
        if (type === "text/plain" &&
            body &&
            body !== null &&
            typeof body !== "string") {
            body = JSON.stringify(body);
        }
        return this.instance.request({
            ...requestParams,
            headers: {
                ...(requestParams.headers || {}),
                ...(type ? { "Content-Type": type } : {}),
            },
            params: query,
            responseType: responseFormat,
            data: body,
            url: path,
        });
    };
}
export class DatacenterPowerApi<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
    datacenterDevices = {
        datacenterDevicesList: (query?: {
            power?: number;
        }, params: RequestParams = {}) => this.request<DsDatacenterDeviceCardSerializer[], any>({
            path: `/datacenter-devices`,
            method: "GET",
            query: query,
            format: "json",
            ...params,
        }),
        datacenterDevicesCreate: (data: {
            name: string;
            image: File;
            video: File;
        }, params: RequestParams = {}) => this.request<DsDatacenterDeviceSerializer, void>({
            path: `/datacenter-devices`,
            method: "POST",
            body: data,
            secure: true,
            type: "multipart/form-data",
            format: "json",
            ...params,
        }),
        datacenterDraftList: (params: RequestParams = {}) => this.request<DsDatacenterDeviceSerializer, void>({
            path: `/datacenter-devices/draft`,
            method: "GET",
            secure: true,
            format: "json",
            ...params,
        }),
        datacenterReelList: (params: RequestParams = {}) => this.request<DsDatacenterDeviceReelSerializer, void>({
            path: `/datacenter-devices/reel`,
            method: "GET",
            format: "json",
            ...params,
        }),
        datacenterReelDetail: (id: number, query?: {
            next?: string;
        }, params: RequestParams = {}) => this.request<DsDatacenterDeviceReelSerializer, void>({
            path: `/datacenter-devices/reel/${id}`,
            method: "GET",
            query: query,
            format: "json",
            ...params,
        }),
        datacenterDevicesDelete: (id: number, params: RequestParams = {}) => this.request<void, void>({
            path: `/datacenter-devices/${id}`,
            method: "DELETE",
            secure: true,
            ...params,
        }),
        datacenterLikeCreate: (id: number, request: DsDatacenterDeviceLikeRequest, params: RequestParams = {}) => this.request<DsDatacenterDeviceSerializer, void>({
            path: `/datacenter-devices/${id}/like`,
            method: "POST",
            body: request,
            secure: true,
            type: "application/json",
            format: "json",
            ...params,
        }),
        datacenterPublishUpdate: (id: number, request: DsDatacenterDevicePublishRequest, params: RequestParams = {}) => this.request<DsDatacenterDeviceSerializer, void>({
            path: `/datacenter-devices/${id}/publish`,
            method: "PUT",
            body: request,
            secure: true,
            type: "application/json",
            format: "json",
            ...params,
        }),
    };
}
