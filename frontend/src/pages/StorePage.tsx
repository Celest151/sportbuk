import { ArrowRight, ArrowUpRight, Check, Clock, MapPin, Phone } from '@phosphor-icons/react'
import { useState } from 'react'
import { SelectField } from '../components/ui/SelectField'
import { getStoreMapUrl, stores } from '../features/stores/stores'

const cities = [...new Set(stores.map((store) => store.city))]

export function StorePage() {
  const [city, setCity] = useState('all')
  const [type, setType] = useState('all')
  const [selectedId, setSelectedId] = useState(stores[0].id)
  const [loadedMapUrl, setLoadedMapUrl] = useState('')
  const [failedMapUrl, setFailedMapUrl] = useState('')
  const visibleStores = stores.filter((store) => (city === 'all' || store.city === city)
    && (type === 'all' || store.flagship === (type === 'flagship')))
  const selectedStore = visibleStores.find((store) => store.id === selectedId) || visibleStores[0]
  const mapUrl = selectedStore ? getStoreMapUrl(selectedStore, true) : ''

  function resetFilters() { setCity('all'); setType('all') }

  return <div className="page-shell page-top store-page">
    <div className="page-intro"><h1>Find a Store</h1><p>Visit SPORTBUK. Choose a store near you and plan your route.</p></div>
    <div className="store-city-filters" role="group" aria-label="Filter by city">
      {[{ value: 'all', label: 'All cities' }, ...cities.map((name) => ({ value: name, label: name }))].map((option) => <button type="button" className={`store-city-chip${city === option.value ? ' is-active' : ''}`} aria-pressed={city === option.value} onClick={() => setCity(option.value)} key={option.value}>{option.label}</button>)}
    </div>
    <div className="store-locator">
      <section className="store-directory" aria-labelledby="store-directory-title">
        <header><h2 id="store-directory-title">Stores</h2><span role="status">{visibleStores.length} locations</span></header>
        <div className="store-type-filter"><label htmlFor="store-type">Store type</label><SelectField id="store-type" value={type} onValueChange={setType} options={[{ value: 'all', label: 'All stores' }, { value: 'flagship', label: 'Flagship' }, { value: 'standard', label: 'Standard' }]} /></div>
        <div className="store-list">{visibleStores.map((store) => <article className={`store-location${store.id === selectedStore?.id ? ' is-selected' : ''}`} key={store.id}>
          <div className="store-location-heading"><span>{store.city}</span>{store.flagship && <small>Flagship</small>}</div>
          <h3>{store.name}</h3>
          <address><MapPin size={18} /><span>{store.address}</span></address>
          <p className="store-detail"><Clock size={18} /><span>Daily · {store.hours}</span></p>
          <a className="store-detail store-phone" href={`tel:+84${store.phone.replace(/\s/g, '').slice(1)}`}><Phone size={18} /><span>{store.phone}</span></a>
          <div className="store-location-actions"><button className="button button-soft" type="button" aria-pressed={store.id === selectedStore?.id} onClick={() => setSelectedId(store.id)}>{store.id === selectedStore?.id ? <>Selected <Check size={17} /></> : <>View on map <ArrowRight size={17} /></>}</button></div>
        </article>)}</div>
        {!visibleStores.length && <div className="store-empty"><MapPin size={32} /><h3>No stores found</h3><p>Change your filters to see more locations.</p><button className="button button-soft" type="button" onClick={resetFilters}>Clear filters</button></div>}
      </section>
      <section className="store-map-panel" aria-label="Store map">
        {selectedStore ? <>
          <div className="store-map-canvas">
            {loadedMapUrl !== mapUrl && failedMapUrl !== mapUrl && <div className="store-map-loading" role="status">Loading Google Maps…</div>}
            <iframe key={mapUrl} src={mapUrl} title={`Map: ${selectedStore.name}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen onLoad={() => setLoadedMapUrl(mapUrl)} onError={() => setFailedMapUrl(mapUrl)} />
            {failedMapUrl === mapUrl && <div className="store-map-loading" role="alert">Could not load the map. Use the directions link below to open Google Maps.</div>}
          </div>
          <div className="store-map-footer"><div className="store-map-summary"><h2>{selectedStore.name}</h2><p>{selectedStore.address}</p><span><Clock size={17} /> Daily · {selectedStore.hours}</span></div><a className="button button-dark" href={getStoreMapUrl(selectedStore)} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight size={18} /></a></div>
        </> : <div className="store-empty"><MapPin size={40} /><h2>Choose a location</h2><p>The map will appear when a store matches your filters.</p></div>}
      </section>
    </div>
  </div>
}
