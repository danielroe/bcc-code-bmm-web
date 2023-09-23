<script lang="ts" setup>
import { TrackSubtype } from "@bcc-code/bmm-sdk-fetch";

const props = defineProps<{
  title: String;
  type: TrackSubtype;
  size: number;
}>();

const { data: tracks } = useTracks({
  contentType: [props.type],
  size: props.size,
});
// const { t } = useI18n();
</script>

<template>
  <section class="relative my-4 mr-3 cursor-pointer gap-2 duration-150">
    <div
      class="bg-slate-100 absolute -inset-x-3 -inset-y-2 rounded-xl opacity-0"
    ></div>
    <section
      v-if="tracks?.length"
      class="relative flex items-center justify-between gap-2"
    >
      <p class="text-2xl font-bold">{{ props.title }}</p>
    </section>
    <TrackItem
      v-for="(track, $index) in tracks"
      :key="$index"
      :track="track"
      :is-track-type-known="true"
    />
  </section>
</template>
