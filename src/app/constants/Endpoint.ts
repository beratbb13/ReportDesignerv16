import { environment } from "../../environments/environments";

export const ServerURLs = {
    bussion: environment.baseUrl + '/api/V3/',
}

export const Endpoints = {
    dataops: ServerURLs.bussion + 'Applications/DataOps',
    formTemplatesDataStoreId: '48355636872643764882',
    formFilesDataStoreId: '44875548684164282155'
};