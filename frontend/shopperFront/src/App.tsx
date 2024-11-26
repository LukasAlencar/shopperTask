import {z} from 'zod'
import { ToastContainer, toast } from 'react-toastify';
import MapComponent from './components/MapComponent';
import axios from 'axios'
import { useState } from 'react'
import { FormRide, formSchema } from './components/FormRide'
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [routeData, setRouteData] = useState<any>({})
  const [isShowDriversOptions, setIsShowDriversOptions] = useState<boolean>(false)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await axios.post(
      'http://localhost:8080/ride/estimate', 
      values, 
      {headers: {'Content-Type': 'application/json'}}
    )
    .then((response) => {
      setRouteData(response.data.response)
      setIsShowDriversOptions(true)
    }).catch(error => {
      toast.error(error.response.data.description, {theme: 'dark'})
    })
  }

  return (
    <div className='w-dvw h-dvh bg-slate-950 flex'>
      <ToastContainer/>
      <section className='w-7/12 h-full opacity-90'>
        <MapComponent routeData={routeData.origin && routeData}/>
      </section>
      {!isShowDriversOptions && (
        <section className='w-5/12 h-full flex justify-evenly items-center flex-col'>
          <header className='flex flex-col items-center'>
              <h1 className='text-slate-200 text-2xl'>Tenha um boa viagem!</h1>
              <h3 className='text-slate-200 text-lg'>Viagem com segurança</h3>
          </header>
          <main className='w-3/6'>
            <FormRide onSubmit={onSubmit}/>
          </main>
        </section>
      )}
    </div>
  )
}

export default App
