import { useEffect, useRef, useState } from 'react'

interface MapProps {
  latitude: number
  longitude: number
  className?: string
}

export function CustomMap({ latitude, longitude, className = '' }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    let attempts = 0
    const maxAttempts = 50 // 5 секунд максимум

    const initMap = () => {
      attempts++

      if (!mapRef.current) return

      if (
        typeof window.google === 'undefined' ||
        typeof window.google.maps === 'undefined'
      ) {
        if (attempts < maxAttempts) {
          setTimeout(initMap, 100)
        } else {
          setError('Google Maps API не загружен')
          console.error('Google Maps API не загрузился после 5 секунд ожидания')
        }
        return
      }

      try {
        const mapStyles = [
          {
            featureType: 'all',
            elementType: 'all',
            stylers: [{ hue: '#e7ecf0' }],
          },
          {
            featureType: 'poi',
            elementType: 'all',
            stylers: [{ visibility: 'off' }],
          },
          {
            featureType: 'road',
            elementType: 'all',
            stylers: [{ saturation: -70 }],
          },
          {
            featureType: 'transit',
            elementType: 'all',
            stylers: [{ visibility: 'off' }],
          },
          {
            featureType: 'water',
            elementType: 'all',
            stylers: [{ visibility: 'simplified' }, { saturation: -60 }],
          },
        ]

        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: latitude, lng: longitude },
          zoom: 15,
          styles: mapStyles,
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_CENTER,
          },
          gestureHandling: 'cooperative',
        })

        new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: map,
        })
      } catch (err) {
        console.error('Ошибка создания карты:', err)
        setError('Ошибка загрузки карты')
      }
    }

    initMap()
  }, [latitude, longitude])

  if (error) {
    return (
      <div
        className={`${className} bg-muted flex items-center justify-center text-muted-foreground`}
      >
        {error}
      </div>
    )
  }

  return <div ref={mapRef} className={className} />
}

declare global {
  interface Window {
    google: any
  }
}
