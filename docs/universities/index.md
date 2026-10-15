---
title: "大学目录"
description: "按地区浏览我们收录的大学信息。"
contentType: university-index
keywords:
  - "大学目录"
---

<script setup>
import directory from '../.vitepress/university-directory.json'

const regions = directory.regions.map((region) => ({
  ...region,
  cities: [...new Map(directory.schools
    .filter((school) => school.region === region.slug)
    .map((school) => [school.city, school])).values()]
})).filter((region) => region.cities.length)
</script>

# 大学目录

按地区浏览已收录的城市和大学。进入地区或城市后，可以继续打开学校页面。

<section v-for="region in regions" :key="region.slug" class="university-directory-region">

<h2>{{ region.title }}</h2>

<p><a :href="`/universities/${region.slug}/`">浏览{{ region.title }}城市</a></p>

<ul>
  <li v-for="city in region.cities" :key="city.city">
    <a :href="`/universities/${region.slug}/${city.city}/`">{{ city.cityTitle }}</a>
  </li>
</ul>

</section>
