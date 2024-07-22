import { createMemoryHistory, createRouter } from 'vue-router'

import TripDetails from '@views/tripDetails/index.vue'
import CreateTrip from '@views/createTrip/index.vue'

const routes = [
  {
    path: '/about', name: 'TripDetails', component: TripDetails
  },
  {
    path: '/', name: 'CreateTrip', component: CreateTrip
  },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router