<template>
    <div class="list">
        <div>head</div>
        <vue-horizontal class="horizontal-selectors">
            <div v-for="fav in favorites" :key="fav.id" class="horizontal-selector">
                <div class="card">
                    <span class="fav-name">{{fav.name}}</span>
                    <img :src="fav.effectiveUrl.url" class="fav-img"/>
                    <span class="fav-price">{{fav.price}}</span>
                </div>
            </div>
        </vue-horizontal>
        <div>footer</div>

    </div>
</template>

<script>
import firebaseApp from "../firebase.js"
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import VueHorizontal from 'vue-horizontal';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import utils from '../utils'

export default {
    name: 'Favorites',
    props: [],
    components: {VueHorizontal},
    data() {
        return {
            favorites: []
        }
    },
    methods: {
        getImgUrl: function(effective) {
            effective.url = require('../assets/bottle2.png')
        },
        async getStorageImgUrl (img, effectiveUrl) {
            if(img.length == 0) {
                this.getImgUrl(effectiveUrl);
                return;
            }
            const storage = getStorage();
            const pathReference = ref(storage, img);
            getDownloadURL(pathReference)
                .then((url) => {
                    effectiveUrl.url = url;
                    console.log("URL", img)
                    console.log("URL", effectiveUrl.url)
                })
                .catch((error) => {
                    console.log(error)
                    return ''
                });
        },
        async loadFavorites() {
            const db = getFirestore(firebaseApp);
            const q = query(
                collection(db, "wines"),
                where("status", "==", 1),
                where("favorite", "==", true));
            onSnapshot(q, (querySnapshot) => {
                this.favorites = [];
                querySnapshot.forEach((doc) => {
                    var record = doc.data();
                    record.id = doc.id;
                    record.effectiveUrl = {url:''};
                    record.price = utils.formatPrice(record.price, true);
                    this.getStorageImgUrl(record.imgUrls[0], record.effectiveUrl);
                    this.favorites.push(record);
                });
                console.log('loadFavorites', this.favorites)
            });
        },
    },
    mounted() {
        this.loadFavorites();
    },
}
</script>

<style scoped>
.list {
    text-align: left;
    overflow: scroll;
}
.card {
    box-shadow: 2px 4px 4px lightgray;
    margin: 10px;
    border: 1px solid lightgray;
    padding: 10px;
    border-radius: 8px;
    min-height: 220px;
    min-width: 160px;
}
.horizontal-selectors {
    padding: 2px;
}
.horizontal-selector {
    margin-left: 5px;
    margin-right: 5px;
}
.fav-name {
    position: absolute;
    font-family: 'Montserrat';
    letter-spacing: -1px;
    top: 5px;
    text-align: left;
    width: 70%;
    font-size: 1.0em;
    color: var(--color-primary);
}
.fav-price {
    position: absolute;
    bottom: 0px;
    font-size: 1.0em;
    font-weight: 500;
    color: #fff;
    margin: 5px;
    background: var(--color-primary);
    border-radius: 4px;
    padding: 1px 5px;
}
.fav-img {
    display: block;
    position: absolute;
    right: -10px;
    top: 5px;
    height: 200px;
}
</style>