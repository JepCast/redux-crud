import { Provider } from "react-redux"
import { productStore } from "./app/store/productStore"
import ProductCrud from "./components/ProductCrud"

function App() {
  return (
    <Provider store={productStore}>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <ProductCrud />
      </div>
    </Provider>
  )
}

export default App