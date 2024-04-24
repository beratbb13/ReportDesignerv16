import { environment } from "../../environments/environments";

export const ServerURLs = {
    bussion: environment.baseUrl + '/api/V3/',
    //connector: window.location.protocol + '//' + window.location.hostname + ':**port**/api/V3/',
}

export const Endpoints = {
    dataops: ServerURLs.bussion + 'Applications/DataOps',
    token: '33722768367448188871',
    forumTemplatesDataStoreId: '48355636872643764882'
};