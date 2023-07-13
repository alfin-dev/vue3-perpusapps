<template>
    <div class="page-wrap d-flex flex-row align-items-center">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-12 text-center">
                    <h1 class="display-1 d-block fw-bold">401</h1>
                    <div class="mb-4 lead">Youre not allowed to enter this page</div>
                    <router-link :to="{ name: 'dashboard' }">Back to Home</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
body {
    background: #dedede;
}

.page-wrap {
    min-height: 100vh;
}
</style>