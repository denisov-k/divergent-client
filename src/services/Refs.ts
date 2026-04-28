import ServiceTransport from './Transport';
import type { AxiosResponse } from 'axios';

export type CollectResponse = Record<string, unknown>;
export type ReferralsResponse = Record<string, unknown>;
export type LinksResponse = Record<string, unknown>;
export enum LinkType {
  Agent = 'agent',
  Player = 'player',
}
export interface CreateLinkPayload {
  reusable: boolean;
  rakeback: number;
  commission: number;
  type: LinkType;
}
export type CreateLinkResponse = Record<string, unknown>;
const transport = new ServiceTransport();
async function callApi<T>(label: string, fn: () => Promise<AxiosResponse<T> | T>): Promise<AxiosResponse<T> | T> {
  try {
    return await fn();
  } catch (err) {
    console.error(`${label} error:`, err);
    throw err;
  }
}
export const collect = () => callApi<CollectResponse>('POST /refs/collect', () => transport.request('/refs/collect', {}, 'post'));
export interface GetReferralsParams {
  from?: string;
  to?: string;
  type?: string;
}
export const getReferrals = (params?: GetReferralsParams) => {
  const qs = params
    ? Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&')
    : '';
  const url = `/refs/referrals${qs ? `?${qs}` : ''}`;
  return callApi<ReferralsResponse>('GET /refs/referrals', () => transport.request(url));
};
export const getReferralsInfo = () => callApi<ReferralsResponse>('GET /refs/info', () => transport.request('/refs/stats'));
export const getLinks = (type?: LinkType) =>
  callApi<LinksResponse>(`GET /refs/links${type ? `?type=${type}` : ''}`, () => transport.request(`/refs/links${type ? `?type=${type}` : ''}`));
export const createLink = (payload: CreateLinkPayload) => callApi<CreateLinkResponse>('POST /refs/create', () => transport.request('/refs/create', payload, 'post'));
const refsApi = { collect, getReferrals, getLinks, createLink, getReferralsInfo };
export default refsApi;
