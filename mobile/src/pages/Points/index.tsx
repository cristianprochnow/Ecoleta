import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert
} from 'react-native'
import Emoji from 'react-native-emoji'
import MapView, { Marker } from 'react-native-maps'
import { SvgUri } from 'react-native-svg'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as Location from 'expo-location'
import { Feather as Icon } from '@expo/vector-icons'

import api from '../../services/api'
import styles from './styles'

interface Item {
  id: number
  title: string
  image_url: string
}

interface Point {
  id: number
  name: string
  image: string
  latitude: number
  longitude:number
  items: {
    title: string
  }[]
}

interface RouteParams {
  uf: string
  city: string
}

const Points: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const routeParams = route.params as RouteParams
  const [items, setItems] = useState<Item[]>([])
  const [points, setPoints] = useState<Point[]>([])
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])

  function handleNavigateBack() {
    navigation.goBack()
  }

  function handleNavigateToDetail(pointId: number) {
    navigation.navigate('Detail', { point_id: pointId })
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

  useEffect(() => {
    loadPosition()

    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync()

      if (status !== 'granted') {
        Alert.alert('Oooops...', 'Precisamos de sua permissão para obter a localização.')

        return
      }

      const location = await Location.getCurrentPositionAsync()

      const { latitude, longitude } = location.coords

      setInitialPosition([ latitude, longitude ])
    }
  }, [])

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data)
    })
  }, [])

  useEffect(() => {
    api.get('points', {
      params: {
        city: routeParams.city,
        uf: routeParams.uf,
        items: selectedItems
      }
    }).then(response => setPoints(response.data))
  }, [selectedItems])

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34CB79" />
        </TouchableOpacity>

        <View>
          <Text style={styles.title}>
            <Emoji name="smile" />
            &nbsp; Bem vindo.
          </Text>
        </View>
        <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

        <View style={styles.mapContainer}>
          { initialPosition[0] !== 0 && (
            <MapView
              style={styles.map}
              loadingEnabled={initialPosition[0] === 0}
              initialRegion={{
                latitude: initialPosition[0],
                longitude: initialPosition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014
              }}
            >
              {points?.map(point => (
                <Marker
                  style={styles.mapMarker}
                  key={String(point.id)}
                  coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }}
                  onPress={() => handleNavigateToDetail(point.id)}
                  >
                <View style={styles.mapMarkerContainer}>
                  <Image style={styles.mapMarkerImage} source={{
                    uri: point.image
                  }} />

                  <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                </View>
                </Marker>
              ))}
            </MapView>
          ) }
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24
          }}
        >
          {items.map(item => (
            <TouchableOpacity
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem : {}
              ]}
              key={String(item.id)}
              onPress={() => handleSelectItem(item.id)}
              activeOpacity={0.4}
            >
              <SvgUri
                width={42}
                height={42}
                uri={item.image_url}
              />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  )
}

export default Points
