const authToken: Ref<string | undefined> = ref();

export enum MediaPlayerStatus {
  Paused = "PAUSED",
  Playing = "PLAYING",
  Stopped = "STOPPED",
}

export interface MediaPlayer {
  status: ComputedRef<MediaPlayerStatus>;
  play: () => void;
  pause: () => void;
}

export interface MediaPlaylist {
  currentSong: ComputedRef<string | undefined>;
  setCurrentSong: (src: string) => void;
  clearCurrentSong: (src: string) => void;
}

export const MediaPlayerInjectionKey: InjectionKey<MediaPlayer> = Symbol(
  "Vue InjectionKey MediaPlayer"
);

export const MediaPlaylistInjectionKey: InjectionKey<MediaPlaylist> = Symbol(
  "Vue InjectionKey MediaPlaylist"
);

export default defineNuxtPlugin((nuxtApp) => {
  const { getAccessTokenSilently, isAuthenticated } =
    nuxtApp.vueApp.config.globalProperties.$auth0;

  watch(
    isAuthenticated,
    async () => {
      authToken.value = await getAccessTokenSilently();
    },
    { immediate: true }
  );

  // Good to know when writing tests: https://github.com/jsdom/jsdom/issues/2155#issuecomment-366703395
  let activeMedia: HTMLAudioElement | undefined;

  const paused = ref(true);
  const ended = ref(false);
  const currentSong: Ref<string | undefined> = ref(undefined);

  const playerStatus = computed(() => {
    if (paused.value) return MediaPlayerStatus.Paused;
    if (ended.value) return MediaPlayerStatus.Stopped;
    return MediaPlayerStatus.Playing;
  });

  nuxtApp.vueApp.provide(MediaPlayerInjectionKey, {
    status: playerStatus,
    play: () => activeMedia?.play(),
    pause: () => activeMedia?.pause(),
  });

  nuxtApp.vueApp.provide(MediaPlaylistInjectionKey, {
    currentSong: computed(() => currentSong.value),
    clearCurrentSong() {
      activeMedia?.pause();
      activeMedia = undefined;
      currentSong.value = "";
      paused.value = true;
      ended.value = false;
    },
    setCurrentSong(src) {
      activeMedia?.pause();

      activeMedia = new Audio(authorizedUrl(src, authToken.value));
      activeMedia.autoplay = true;
      currentSong.value = src;
      paused.value = true;
      ended.value = false;

      activeMedia.addEventListener("pause", () => {
        paused.value = true;
      });
      activeMedia.addEventListener("loadstart", () => {
        if (activeMedia?.autoplay) {
          paused.value = false;
          ended.value = false;
        }
      });
      activeMedia.addEventListener("play", () => {
        paused.value = false;
        ended.value = false;
      });
      activeMedia.addEventListener("playing", () => {
        paused.value = false;
      });
      activeMedia.addEventListener("ended", () => {
        ended.value = true;
      });
    },
  });
});
