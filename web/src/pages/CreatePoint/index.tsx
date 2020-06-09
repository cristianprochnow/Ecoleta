import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import axios from 'axios'

import api from '../../services/api'
import logo from '../../assets/logo.svg'

import Dropzone from '../../components/Dropzone'
import InputText from '../../components/InputText'
import SelectBox from '../../components/SelectBox'

import './styles.css'

interface ItemProps {
  id: number,
  title: string,
  image_url: string
}

interface IBGEUFResponse {
  sigla: string
}

interface IBGECityResponse {
  nome: string
}

const CreatePoint = () => {
  const history = useHistory()

  const [items, setItems] = useState<ItemProps[]>([])
  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])

  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  })

  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])
  const [selectedFile, setSelectedFile] = useState<File>()

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords

      setInitialPosition([latitude, longitude])
    })
  }, [])

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data)
    })
  }, [])

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        const ufInitials = response.data.map(uf => uf.sigla)

        setUfs(ufInitials)
      })
  }, [])

  useEffect(() => {
    if(selectedUf === '0') {
      return
    }

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
        const citiesFromSpecificUf = response.data.map(city => city.nome)

        setCities(citiesFromSpecificUf)
      })
  }, [selectedUf])

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value

    setSelectedUf(uf)

    console.log(selectedUf)
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value

    setSelectedCity(city)
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng
    ])
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target

    setFormData({ ...formData, [name]: value })
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex(item => item === id)

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id)

      setSelectedItems(filteredItems)
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const { name, email, whatsapp } = formData
    const uf = selectedUf
    const city = selectedCity
    const [latitude, longitude] = selectedPosition
    const items = selectedItems

    const submitData = new FormData()

    submitData.append('name', name)
    submitData.append('email', email)
    submitData.append('whatsapp', whatsapp)
    submitData.append('uf', uf)
    submitData.append('city', city)
    submitData.append('latitude', String(latitude))
    submitData.append('longitude', String(longitude))
    submitData.append('items', items.join(','))

    if (selectedFile) {
      submitData.append('image', selectedFile)
    }

    await api.post('points', submitData)

    alert('Ponto de coleta cadastrado com sucesso!')

    history.push('/')
  }

  return(
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />

        <Link to="/">
          <FiArrowLeft />
          Voltar para a home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br /> ponto de coleta </h1>

        <Dropzone onFileUploaded={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <InputText
            labelWord="Nome da entidade"
            typingExample=""
            htmlPropsName="name"
            inputValue={formData.name}
            onHandleChange={handleInputChange}
          />

          <div className="field-group">
            <InputText
              labelWord="E-mail"
              typingExample="example@domain.com"
              htmlPropsName="email"
              inputValue={formData.email}
              onHandleChange={handleInputChange}
            />

            <InputText
              labelWord="Número de WhatsApp"
              typingExample="(XX) X XXXX-XXXX"
              htmlPropsName="whatsapp"
              inputValue={formData.whatsapp}
              onHandleChange={handleInputChange}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>

            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map
            center={initialPosition}
            zoom={15}
            onclick={handleMapClick}
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <SelectBox
              labelWord="Estado (UF)"
              htmlPropsName="uf"
              description="Selecione uma UF"
              selectValue={selectedUf}
              optionsData={ufs}
              onHandleSelect={handleSelectUf}
            />

            <SelectBox
              labelWord="Cidade"
              htmlPropsName="city"
              description="Selecione uma cidade"
              selectValue={selectedCity}
              optionsData={cities}
              onHandleSelect={handleSelectCity}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Itens para coleta</h2>

            <span>Selecione um ou mais itens abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map(item => (
                <li
                  key={item.id}
                  onClick={() => handleSelectItem(item.id)}
                  className={selectedItems.includes(item.id) ? 'selected' : ''}
                >
                  <img src={item.image_url} alt={item.title} />
                  <span>{item.title}</span>
                </li>
              ))}
          </ul>
        </fieldset>

        <button type="submit">
          Cadastrar ponto de coleta
        </button>
      </form>
    </div>
  );
}

export default CreatePoint
