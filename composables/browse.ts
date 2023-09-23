import { BrowseApi } from "@bcc-code/bmm-sdk-fetch";


export function useBrowseEvents() {
    return reactiveApi(
        useLazyAsyncData(`events`, () => new BrowseApi().browseEventsGet())
    );
}

export function useBrowseAudiobooks() {
    return reactiveApi(
        useLazyAsyncData(`audiobooks`, () => new BrowseApi().browseAudiobooksGet())
    );
}

export function useBrowsePodcasts() {
    return reactiveApi(
        useLazyAsyncData(`podcasts`, () => new BrowseApi().browsePodcastsGet())
    );
}

export function useBrowseMusic() {
    return reactiveApi(
        useLazyAsyncData(`music`, () => new BrowseApi().browseMusicGet())
    );
}