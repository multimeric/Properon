import reducer from './reducers/reducer';
import {composeWithDevTools} from 'redux-devtools-extension';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import FsaThunk from 'fsa-redux-thunk';

const store = createStore(
    reducer,
    composeWithDevTools(
        applyMiddleware(
            FsaThunk
        )
    )
);
export default store;


