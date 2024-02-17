<script setup>
import { ref, onMounted } from "vue";
import { NextStorage } from "@/services/NextStorage";
import { ufabcMatricula } from "@/services/UFABCMatricula";
import { extensionUtils } from "@/utils/extensionUtils";

const showWarning = ref(false);
const selected = ref(false);
const cursadas = ref(false);
const teachers = ref(false);

onMounted(async () => {
  const students = await NextStorage.getItem("ufabc-extension-students");
  const currentUser = ufabcMatricula.currentUser();

  const currentStudent = students.find((student) => {
    student.name === currentUser;
  });

  if (currentStudent?.lastUpdate) {
    const diff = Date.now() - currentStudent.lastUpdate;
    const MAX_UPDATE_DIFF = 1000 * 60 * 60 * 24 * 7; // 7 days
    if (diff > MAX_UPDATE_DIFF) {
      showWarning.value = true;
    }
  }

  teachers.value = true;
  changeTeachers();
});

const getURL = (path) => extensionUtils.chromeURL(path);

const changeTeachers = () => {};
</script>

<template>
  <div class="ufabc-row filters">
    <div class="mr-3 ufabc-row ufabc-align-center">
      <img
        :src="getURL('/assets/icon-128.png')"
        style="width: 32px; height: 32px"
      />
    </div>

    <div class="mr-5">
      <h3 class="title-filter">Campus</h3>
      <el-checkbox
        v-for="(filter, index) in campusFilters"
        :key="index"
        @change="changeCampus(filter)"
        >{{ filter.name }}</el-checkbox
      >
    </div>
  </div>
</template>

<style scoped lang="css">
* {
  font-family: Ubuntu;
}

.filters {
  position: sticky;
  top: 0px;
  background: #fff;
  min-height: 56px;
  padding-left: 24px;
  padding-top: 6px;
  z-index: 1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding-bottom: 12px;
}

.title-filter {
  font-size: 14px;
  margin-bottom: 2px;
  color: rgba(0, 0, 0, 0.9);
}

.warning-advice > a {
  color: rgb(0, 0, 238);
}
</style>
