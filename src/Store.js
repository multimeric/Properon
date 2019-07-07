import reducer from './reducers/reducer';
import {composeWithDevTools} from 'redux-devtools-extension';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import FsaThunk from 'fsa-redux-thunk';
import { reducer as formReducer } from 'redux-form'

const store = createStore(
    combineReducers({
        // ...your other reducers here
        // you have to pass formReducer under 'form' key,
        // for custom keys look up the docs for 'getFormState'
        data: reducer,
        form: formReducer
    }),
    composeWithDevTools(
        applyMiddleware(
            FsaThunk
        )
    )
);
export default store;


