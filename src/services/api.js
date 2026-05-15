import axios from 'axios'

const http = axios.create({
  baseURL: '/api',
  timeout: 15000
})

export async function fetchDirections() {
  const { data } = await http.get('/directions.json')
  return data
}

export async function fetchPeople(directionKey) {
  const { data } = await http.get(`/people/${directionKey}.json`)
  return data
}

export async function fetchDistrictMap(regionKey) {
  const { data } = await http.get(`/districts/${regionKey}.json`)
  return data
}
