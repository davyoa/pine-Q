<template>
    <div></div>
</template>

<script setup lang="ts">


const router = useRouter();

const loggedIn = true;

if(loggedIn){
    router.push('/home');
}else{
    router.push('/landingPage')
}

definePageMeta({
  layout: false,
})
</script>