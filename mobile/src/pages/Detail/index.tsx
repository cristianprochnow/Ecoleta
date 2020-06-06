import React, { useState, useEffect } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Linking
} from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import * as MailComposer from 'expo-mail-composer'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Feather as Icon, FontAwesome } from '@expo/vector-icons'

import api from '../../services/api'
import styles from './styles'

interface RouteParams {
  point_id: number
}

interface PointDetails {
  point: {
    image: string
    image_url: string
    name: string
    email: string
    whatsapp: string
    city: string
    uf: string
  },
  items: {
    title: string
  }[]
}

const Detail: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const [pointDetails, setPointDetails] = useState<PointDetails>({} as PointDetails)

  const routeParams = route.params as RouteParams

  function handleNavigateBack() {
    navigation.goBack()
  }

  async function handleComposeMail() {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [pointDetails.point.email]
    })
  }

  function handleWhatsapp() {
    Linking.openURL(`whatsapp://send?phone=${pointDetails.point.whatsapp}&text=Tenho interesse na coleta de resíduos.`)
  }

  useEffect(() => {
    const pointIdFromRoute = routeParams.point_id

    api.get(`points/${pointIdFromRoute}`)
      .then(response => setPointDetails(response.data))
  }, [])

  if (!pointDetails.point) {
    return null
  }

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <TouchableOpacity onPress={handleNavigateBack}>
            <Icon name="arrow-left" size={20} color="#34CB79" />
          </TouchableOpacity>

          <Image
            style={styles.pointImage}
            source={{ uri: pointDetails.point.image_url }}
          />
          <Text style={styles.pointName}>{pointDetails.point.name}</Text>
          <Text style={styles.pointItems}>{
            pointDetails.items.map(item => item.title).join(', ')
          }</Text>

          <View style={styles.address}>
            <Text style={styles.addressTitle}>Endereço</Text>
            <Text style={styles.addressContent}>
              {`${pointDetails.point.city}, ${pointDetails.point.uf}`}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <RectButton
            style={styles.button}
            onPress={handleWhatsapp}
          >
            <FontAwesome name="whatsapp" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Whatsapp</Text>
          </RectButton>

          <RectButton
            style={styles.button}
            onPress={handleComposeMail}
          >
            <Icon name="mail" size={20} color="#FFF" />
            <Text style={styles.buttonText}>E-mail</Text>
          </RectButton>
        </View>
      </SafeAreaView>
    </>
  )
}

export default Detail
