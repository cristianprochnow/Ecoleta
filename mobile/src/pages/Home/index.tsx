import React, { useState, useEffect } from 'react'
import {
  View,
  ImageBackground,
  Image,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import RNPickerSelect from 'react-native-picker-select'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Feather as Icon } from '@expo/vector-icons'
import axios from 'axios'

import styles from './styles'

interface UfsProps {
  sigla: string
  nome: string
}[]

interface CityProps {
  nome: string
}[]

interface ButtonState {
  style: object
  disabled: boolean
}

const Home: React.FC = () => {
  const navigation = useNavigation()
  const [ufs, setUfs] = useState<UfsProps[]>([])
  const [selectedUf, setSelectedUf] = useState('')
  const [cities, setCities] = useState<CityProps[]>([])
  const [selectedCity, setSelectedCity] = useState('')

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity
    })
  }

  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => setUfs(response.data))
  }, [])

  useEffect(() => {
    axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => setCities(response.data))
  }, [selectedUf])

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        style={styles.container}
        source={require('../../assets/home-background.png')}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />

          <View>
            <Text style={styles.title}> Seu marketplace de coleta de resíduos.</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.select}>
            <RNPickerSelect
              onValueChange={(value) => setSelectedUf(value)}
              value={selectedUf}
              placeholder={
                { label: 'Selecione seu estado...', value: null }
              }
              items={ufs.map(uf => {
                return { key: uf.nome, label: uf.nome, value: uf.sigla }
              })}
            />
          </View>

          <View style={styles.select}>
            <RNPickerSelect
              onValueChange={(value) => setSelectedCity(value)}
              value={selectedCity}
              placeholder={
                { label: 'Selecione sua cidade...', value: null }
              }
              items={cities.map(city => {
                return { key: city.nome, label: city.nome, value: city.nome }
              })}
            />
          </View>

          <RectButton
            style={styles.button}
            onPress={() => {
              if (selectedUf === '' || selectedCity === '') {
                Alert.alert('Campo de preenchimento obrigatório', 'Por favor, selecione um estado e cidade, por favor.')
              } else {
                handleNavigateToPoints()
              }
            }}
          >
            <View style={styles.buttonIcon}>
              <Text>
                <Icon
                  name="arrow-right"
                  color="#FFF"
                  size={24}
                />
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

export default Home
