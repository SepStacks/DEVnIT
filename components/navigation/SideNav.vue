<template>
<div>
    <v-app-bar app clipped-left>

        <v-toolbar-title class="ml-4">
            <div class="font-weight-bold">SepStacks</div>
            <!-- <v-img src="/svg/altron.svg" max-width="50%" /> -->
        </v-toolbar-title>
        <v-spacer />

        <!-- links -->
        <v-card-actions>
            <v-btn text to="/">
              home
            </v-btn>

                <v-btn text to="/projects">
              Projects
            </v-btn>
            <v-btn text to="/create_update">
              Create
            </v-btn>

        </v-card-actions>

    </v-app-bar>

    <v-navigation-drawer permanent app clipped v-model="drawer">

        <v-list nav dense>
            <!-- Reverse function to reverse component headers order -->
            <div v-for="(header, index) in Object.keys(headers).reverse()" :key="index">
                <div class="font-weight-bold">{{ header }}</div>

                <v-list-item v-for="(slug, innerIndex) in headers[header]" :key="innerIndex" :to="slug">
                    {{ slug === "index" ? "Installation" : slug }}
                </v-list-item>
            </div>
        </v-list>

    </v-navigation-drawer>
</div>
</template>

<script>
export default {
    props: {
        menus: {
            type: Array
        }
    },
    data() {
        return {
            drawer: null,

        }
    },
    computed: {
        headers() {
            let ar = [];

            this.menus.forEach(el => {
                ar.push({
                    title: el.title,
                    path: el.path,
                    slug: el.slug,
                    header: el.slug === "index" ? "Getting Started" : el.slug === "commits" ? "Gitlab Commits" : "Components"
                });
            });

            return ar.reduce((header, group) => {
                if (
                    header.hasOwnProperty(group.header) &&
                    Array.isArray(header[group.header])
                ) {
                    header[group.header].push(group.slug);
                } else {
                    Object.assign(header, {
                        [group.header]: [group.slug]
                    });
                }
                return header;
            }, {});
        }
    }
};
</script>
