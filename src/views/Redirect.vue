<script setup>
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
console.log('route: ', route);
const router = useRouter();
const { params, query } = route;
const { path } = params;
console.log('path: ', path);

router.replace({ path: '/' + path.join('/'), query });
</script>
