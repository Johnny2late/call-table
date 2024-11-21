export async function fetchList(
  dateStart,
  dateEnd,
  inOut = ' ',
  sort = 'date',
  offset,
  limit = 10,
) {
  const response = await fetch(
    `https://api.skilla.ru/mango/getList?date_start=${dateStart}&date_end=${dateEnd}${inOut ? '&in_out=' + inOut : ''}&limit=${limit}&offset=${offset}&sort_by=${sort}`,
    {
      method: 'POST',
      headers: { Authorization: 'Bearer testtoken' },
    },
  )

  if (!response.ok) {
    throw new Error(response.status)
  }

  return await response.json()
}

export async function fetchRecord(recordId, partnerId) {
  const response = await fetch(
    `https://api.skilla.ru/mango/getRecord?record=${recordId}&partnership_id=${partnerId}`,
    {
      method: 'POST',
      headers: { Authorization: 'Bearer testtoken' },
    },
  )

  if (!response.ok) {
    throw new Error(response.status)
  }

  const blob = await response.blob()

  const audioUrl = URL.createObjectURL(blob)

  return audioUrl
}
