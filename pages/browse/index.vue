<script lang="ts" setup>
import { TrackSubtype } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.browse"));

const { data: playlists } = useCuratedPlaylists();
const subsections = [{ title: "bla", type: TrackSubtype.Speech, size: 9 }];
</script>

<template>
  <div>
    <PageHeading class="mb-6">{{ $t("nav.browse") }}</PageHeading>
    <BrowseSection
      v-for="(subsection, $index) in subsections"
      :key="$index"
      :title="subsection.title"
      :type="subsection.type"
      :size="subsection.size"
    />
    <PlaylistCarousel v-if="playlists" :playlists="playlists" />
  </div>
</template>
