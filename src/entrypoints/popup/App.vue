<script lang="ts" setup>
import { Loader2 } from 'lucide-vue-next'
import { useStorage } from '@/composables/useStorage'
import { useQuery } from '@tanstack/vue-query'
import { getStudent, type MatriculaStudent } from '@/services/next'

const { state: student, isLoading: loading, error } = useStorage<{ ra: string; login: string }>('local:student')

console.log(student.value)

const {
  data: studentCoefficients,
  isLoading: isFetching,
  error: fetchError
} = useQuery({
  queryKey: ['studentCoefficients', student],
  queryFn: async () => {
    if (!student.value?.login) {
      return {} as MatriculaStudent;
    }
    const dbStudent = await getStudent(student.value.login, student.value.ra)
    return dbStudent
  },
  enabled: !!student.value?.ra && !!student.value?.login
})
</script>

<template>
  <div class="w-64 p-4">
    <img src="/logo.svg" class="h-8 w-36" alt="next logo" />

    <main class="mt-4 text-sm">
      <div class="flex items-center justify-center h-[4.4rem]" v-if="loading">
        <Loader2 class="h-4 w-4 animate-spin" />
        <span class="ml-2">Carregando informações...</span>
      </div>

      <div v-else-if="error">
        Aconteceu um erro ao carregar suas informações. 😬
        <br /><br />
        Caso o error persistir, entre em contato conosco pelo <a href='https://instagram.com/ufabc_next' target='_blank'>Instagram</a>
      </div>

      <div v-else-if="student">
        <p class="mb-2">Esses são seus dados</p>
        <section class="mb-2 border border-solid border-b-gray-400 rounded p-1.5">
          <div class="flex mb-2">
            <h3 class="font-bold flex-auto">{{ student.login }}</h3>
            <span class="flex-none text-right text-sm">{{ student.ra }}</span>
          </div>
          <template v-if="!isFetching && studentCoefficients">
            <div class="mb-2 border border-solid border-[#efefef] rounded p-1.5" v-for="graduation in studentCoefficients.graduations">
              <div class="text-sm mb-1">
                {{ graduation.name }}<br />
                <b>{{ graduation.shift }}</b>
              </div>
              <div class="flex">
                <span class="flex-1 text-sm text-left text-[#c78d00]">CP: {{ graduation.cp }}</span>
                <span class="flex-1 text-sm text-center text-[#05C218]">CR: {{ graduation.cr }}</span>
                <span v-if="!graduation.ca" class="flex-1 text-sm text-right text-[#2E7EED]">CA: {{ graduation.ca }}</span>
              </div>
            </div>
          </template>
          <p class="flex-none text-sm">Última atualização: {{ studentCoefficients?.updatedAt }}</p>
        </section>

        <div class="flex items-center justify-center mb-3">
          <a href='https://sig.ufabc.edu.br/sigaa/portais/discente/discente.jsf' target='_blank'>Atualizar dados agora</a>
        </div>
      </div>

      <template v-else>
        <p class="mb-1.5 text-xs">Seja bem-vindo à extensão do UFABC next.</p>
        <p class="mb-1.5 text-xs">Parece que nós não temos suas informações,
          <a
          href='https://sig.ufabc.edu.br/sigaa/portais/discente/discente.jsf'
          target='_blank'
          class="underline text-xs decoration-sky-500"
          >vamos carregá-las?</a>
        </p>
      </template>

      <div class="text-center underline text-[11px] font-normal decoration-sky-500">
        <a href='https://bit.ly/extensao-problemas' target='_blank'>Está com problemas com a extensão? <br />Clique aqui</a>
      </div>
    </main>
  </div>
</template>
