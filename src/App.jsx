import { Route, Switch } from 'react-router-dom'
import GuestList from './guest-list'
import Rsvp from './rsvp'

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/rsvp/:token" component={Rsvp} />

        <Route path="/guests/secret-link" component={GuestList} />
        
        <Route path="/">
          404: Invalid page
        </Route>
      </Switch>
    </div>
  );
}

export default App;
