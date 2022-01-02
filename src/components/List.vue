<template>
    <div class="list">
        <div v-if="filter.length > 0">
        </div>
        <vue-horizontal class="horizontal-selectors">
            <div class="horizontal-selector">
                <b-button size="sm" pill variant="outline-warning" @click="filterByRegion(null)">
                    {{$t('generic.all_regions')}}
                </b-button>
            </div>
            <div v-for="region in regions" :key="region" class="horizontal-selector">
                <b-button size="sm" pill variant="outline-warning" @click="filterByRegion(region)">
                    {{region}}
                </b-button>
            </div>
        </vue-horizontal>
        
        <ul>
            <li v-for="item in winelist" :key="item.id">
                <div class="card" @click="goToDetails(item)">
                    <span class="name">{{item.name}}</span>
                    <div class="details">
                        <span class="winery">{{item.winery.name}}</span>
                        <span class="region">{{item.region}}</span>
                    </div>
                    <span class="price">{{item.price}}</span>
                    <img :src="item.effectiveUrl.url" class="detail-img"/>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import firebaseApp from "../firebase.js"
import { getFirestore, collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import VueHorizontal from 'vue-horizontal';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import utils from '../utils'

export default {
    name: 'List',
    props: ['tipology'],
    components: {VueHorizontal},
    data() {
        return {
            winelist: [],
            filteredList: [],
            backupList: [],
            filter: [],
            regions: [],
            grapes: ['Cabernet', 'Merlot', 'Pinot', 'Sangiovese'],
            imgUrl: ''
        }
    },
    methods: {
        goToDetails: function(item) {
            this.$router.push({
                name: 'details',
                params: {
                    wine: item
                }
            })
        },
        filterByRegion: function(region) {
            this.filteredList = [];
            if(region == null) {
                this.filter = [];
                this.winelist = this.backupList;
                return;
            }

            for(var i=0; i<this.winelist.length; i++) {
                if(this.winelist[i].region == region) {
                    this.filteredList.push(this.winelist[i]);
                }
            }
            this.backupList = JSON.parse(JSON.stringify(this.winelist));
            this.winelist = this.filteredList;
            this.filter.push(region);
        },
        filterByWinery: function(winery) {
            this.filteredList = [];
            for(var i=0; i<this.winelist.length; i++) {
                if(this.winelist[i].winery.name == winery) {
                    this.filteredList.push(this.winelist[i]);
                }
            }
            this.backupList = JSON.parse(JSON.stringify(this.winelist));
            this.winelist = this.filteredList;
            this.filter.push(winery);
        },
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
        async loadProducts () {
            const db = getFirestore(firebaseApp);
            const q = query(
                collection(db, "wines"),
                where("status", "==", 1),
                where("type", "==", this.tipology),
                orderBy("name"));
            onSnapshot(q, (querySnapshot) => {
                this.winelist = [];
                querySnapshot.forEach((doc) => {
                    var record = doc.data();
                    record.id = doc.id;
                    record.effectiveUrl = {url:''};
                    record.price = utils.formatPrice(record.price, true);
                    this.getStorageImgUrl(record.imgUrls[0], record.effectiveUrl);
                    this.winelist.push(record);
                });
                console.log('loadProducts', this.winelist)
                this.getRegions();
            });
        },
        getRegions: function() {
            this.regions = [];
            for(var i=0; i<this.winelist.length; i++) {
                if(this.regions.indexOf(this.winelist[i].region) == -1) {
                    this.regions.push(this.winelist[i].region)
                }
            }

            this.regions.sort();
        }
    },
    mounted() {
        console.log('List', this.tipology)
        this.loadProducts();
    },
}
</script>

<style scoped>
.list {
    text-align: left;
    overflow: scroll;
}
.card {
    box-shadow: 5px 5px 10px #B0BEC5;
    margin: 10px;
    border: 1px solid #B0BEC5;
    padding: 10px;
    border-radius: 8px;
    min-height: 120px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin-top: 30px;
}
.name {
    font-size: 1.2em;
    font-weight: bold;
    max-width: 75%;
    color: #8D6E63
}
.price {
    position: absolute;
    right: 10px;
    bottom: 4px;
}
.region {
    color: #9aa2a7;
    margin-left: 10px;
}
.winery {
    font-size: 1.1em;
    color: #8D6E63
}
.detail-img {
    display: block;
    position: absolute;
    right: 10px;
    top: -30px;
    height: 120px;
}
.horizontal-selectors {
    padding: 2px;
}
.horizontal-selector {
    margin-left: 5px;
    margin-right: 5px;
}
.details {
}
</style>