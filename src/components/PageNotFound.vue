<template>
    <div class="pageNotFound">
        <div>
            <h1> 
                <i class="fas fa-exclamation-triangle"></i>
                    &nbsp;404 - Page not found&nbsp;
                <i class="fas fa-exclamation-triangle"></i>    
            </h1>
            <router-link to="/">
                <i class="fas fa-arrow-right"></i>
                    &nbsp;<span>Go back to the application</span>&nbsp;
                <i class="fas fa-arrow-left"></i>
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'PageNotFound'
    }
</script>

<style lang="sass" scoped>
.pageNotFound 
    height: calc(100vh - var(--header-size))
    width: 100%
    div
        text-align: center
        padding-top: 2.5rem
        a 
            text-decoration: none
            color: blue
            &>span:hover
                text-decoration: underline
</style>