<template>
  <div class="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
    <div class="max-w-3xl w-full px-6 text-center space-y-10">
      <div class="flex flex-col items-center gap-1">
        <img src="/logo.svg" alt="planner IO">
        <p class="text-zinc-300 text-lg">
          Convide seus amigos e planeje sua próxima viagem!
        </p>
      </div>

      <div class="space-y-4">
        <div class="h-16 bg-zinc-900 px-4 rounded-xl flex items-center shadow-shape gap-3">
          <div class="flex items-center gap-2 flex-1">
            <MapPin class="size-5 text-zinc-400" />
            <input type="text" name="onde" id="onde" placeholder="Para onde você vai?" :disabled="isGuestInputOpen"
              class="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"></input>
          </div>
          <div class="flex items-center gap-2">
            <Calendar class="size-5 text-zinc-400" />
            <input type="text" name="quando" id="quando" placeholder="Quando?" :disabled="isGuestInputOpen"
              class="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none"></input>
          </div>
          <div class="w-px h-6 bg-zinc-800"></div>

          <button v-if="!isGuestInputOpen" class="bg-lime-300 text-lime-950 rounded-lg px-5 py-2 flex items-center gap-2 hover:bg-lime-500"
            @click="openGuestInput">
            Continuar
            <ArrowRight class="size-5" />
          </button>
          <button 
            v-if="isGuestInputOpen"
            class="bg-zinc-800 text-zinc-200 rounded-lg px-5 py-2 flex items-center gap-2 hover:bg-zinc-700"
            @click="closeGuestInput">
              Alterar local/data
            <Settings2 class="size-5" />
          </button>
        </div>
        <div class="h-16 bg-zinc-900 px-4 rounded-xl flex items-center shadow-shape gap-3" v-if="isGuestInputOpen">
          <button type="button" @click="openGuestModal" class="flex items-center gap-2 flex-1 text-left">
            <UserRoundPlus class="size-5 text-zinc-400" />
            <span
              class="text-lg  flex-1"
              :class="{
                'text-zinc-400': guestList.size === 0,
                'text-zinc-100': guestList.size > 0
              }"
            >
              {{ guestList.size ? `${guestList.size} pessoa(s) convidada(s)` : 'Quem estará na viagem?' }}
            </span>
          </button>
          <div class="w-px h-6 bg-zinc-800"></div>

          <button class="bg-lime-300 text-lime-950 rounded-lg px-5 py-2 flex items-center gap-2 hover:bg-lime-500"
            @click="openConfirmTripModal">
            Confirmar viagem
            <ArrowRight class="size-5" />
          </button>
        </div>
      </div>

      <p class="text-sm text-zinc-500">
        Ao planejar sua viagem pela plann.er você automaticamente concorda
        <br />
        com nossos
        <a class="text-zinc-300 underline" href="">termos de uso</a>
        e
        <a class="text-zinc-300 underline" href="">políticas de privacidade</a>.
      </p>
    </div>

    <div
      v-if="isGuestModalOpen"
      class="fixed inset-0 bg-black/60 flex items-center justify-center"
    >
      <div
        class="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5"
      >
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">
              Selecionar convidados
            </h2>
            <button type="button" @click="closeGuestModal">
              <X class="size-5 text-zinc-400"/>
            </button>
          </div>
          <p class="text-sm text-zinc-400">
            Os convidados irão receber e-mails para confirmar a participação na viagem.
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <div class="py-1.5 px-2.5 rounded-md bg-zinc-800 flex items-center gap-2"
            v-if="guestList.size"
            v-for="(guest, key) in guestList.values()"
            :key="key"
          >
            <span class="text-zinc-300">{{guest.toString()}}</span>
            <button type="button" @click="() => removeGuestFromList(guest.toString())"><X class="size-4 text-zinc-400"></X></button>
          </div>
        </div>
        <div class="w-full h-px bg-zinc-800"></div>
        <div
          class="p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-between gap-2"
        >
          <div class="px-1 flex items-center flex-1 gap-2">
            <AtSign class="size-5 text-zinc-400" />
            <input type="email" name="guestEmail" id="guestEmail" placeholder="Digite o e-mail do convidado" 
              class="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
              v-model="guestEmail"
              @keyup.enter="addGuestToList">
          </div>
          <button type="button" class="bg-lime-300 text-lime-950 rounded-lg px-5 py-2 flex items-center gap-2 hover:bg-lime-500"
            @click="addGuestToList"
            >
            Convidar
            <Plus class="size-5" />
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="isConfirmTripModalOpen"
      class="fixed inset-0 bg-black/60 flex items-center justify-center"
    >
      <div
        class="w-[540px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5"
      >
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">
              Confirmar criação da viagem
            </h2>
            <button type="button" @click="closeConfirmTripModal">
              <X class="size-5 text-zinc-400"/>
            </button>
          </div>
          <p class="text-sm text-zinc-400">
            Para concluir a criação da viagem para 
            <span class="font-semibold text-zinc-100">{{ ' cidade aqui ' }}</span>
             nas datas de 
            <span class="font-semibold text-zinc-100">{{ ' data aqui ' }}</span>
            preencha seus dados abaixo:
          </p>
        </div>
        <div
          class="p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-between gap-2"
        >
          <div class="px-1 flex items-center flex-1 gap-2">
            <User class="size-5 text-zinc-400" />
            <input type="text" name="name" id="name" placeholder="Seu nome completo" 
              class="bg-transparent text-base placeholder-zinc-400 outline-none flex-1"
              v-model="name"
              @keyup.enter="addGuestToList">
          </div>
        </div>
        <div
          class="p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-between gap-2"
        >
          <div class="px-1 flex items-center flex-1 gap-2">
            <AtSign class="size-5 text-zinc-400" />
            <input type="email" name="email" id="email" placeholder="Seu e-mail pessoal" 
              class="bg-transparent text-base placeholder-zinc-400 outline-none flex-1"
              v-model="email"
              @keyup.enter="addGuestToList">
          </div>
        </div>
        <button type="button" class="bg-lime-300 text-lime-950 text-base rounded-lg px-5 py-2 flex items-center justify-center gap-2 hover:bg-lime-500 w-full"
          @click="addGuestToList"
          >
          Confirmar criação da viagem
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MapPin, Calendar, ArrowRight, UserRoundPlus, Settings2, X, AtSign, Plus, User } from 'lucide-vue-next'
import { ref } from 'vue'

const isGuestInputOpen = ref<boolean>(false)
const isGuestModalOpen = ref<boolean>(false)
const isConfirmTripModalOpen = ref<boolean>(false)

const guestList = ref<Set<String>>(new Set())
const guestEmail = ref<string>('')
const email = ref<string>('')
const name = ref<string>('')

function openGuestInput() {
  isGuestInputOpen.value = true
}

function closeGuestInput() {
  isGuestInputOpen.value = false
}

function openGuestModal() {
  isGuestModalOpen.value = true
}

function closeGuestModal() {
  isGuestModalOpen.value = false
}

function addGuestToList() {
  if (!guestEmail.value) {
    return
  }

  guestList.value.add(guestEmail.value)
  guestEmail.value = ''
}

function removeGuestFromList(email: string) {
  guestList.value.delete(email)
}

function openConfirmTripModal() {
  isConfirmTripModalOpen.value = true
}

function closeConfirmTripModal() {
  isConfirmTripModalOpen.value = false
}

</script>

<style scoped></style>
