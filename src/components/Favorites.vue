<template>
    <div>
        <b-container>

        <b-card-group column>
            <b-card
                title="Title"
                :img-src="getImgUrl('bottle.png')"
                img-alt="Image"
                overlay
                img-width="3rem"
                img-top
                style="min-width: 9rem;max-width: 12rem;"
                class="mb-2 shadow"
                v-for="index in [1, 2, 3, 4, 5]" :key="index">
      <b-card-text>
        This is a wider card with supporting text below as a natural lead-in to additional content.
        This content is a little bit longer.
      </b-card-text>
      <template #footer>
        <small class="text-muted">Last updated 3 mins ago</small>
      </template>
    </b-card>

        </b-card-group>
        </b-container>
    </div>
</template>

<script>
export default {
    name: 'Favorites',
    props: [],
    data() {
        return {
            
        }
    },
    methods: {
        getImgUrl: function(img) {
            return require('../assets/' + img)
        }
    },
}
</script>

<style scoped>
.shadow {
    box-shadow: 10px 10px;
    margin: 10px;
}
</style>