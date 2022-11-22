import { Component } from 'react';
import PropTypes from 'prop-types'
import MarvelService from "../../services/MarvelService";
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';

class CharList extends Component {

    state = {
        charList: [],
        loading: true,
        error: false,
        newItemsLoading: false,
        offset: 210,
        charsEnded: false
    };

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError);
    }

    onCharListLoading = () => {
        this.setState({
            newItemsLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        this.setState(({charList, offset}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemsLoading: false,
            offset: offset + 9,
            charsEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    handleKeyDown = (event, id) => {
        if (event.code === 'Space' || event.code === 'Enter') {
            this.props.onSelectedChar(id)
        }
    };

    render() {
        const { charList, loading, error, newItemsLoading, offset, charsEnded } = this.state;
        const charCards = charList.map(char => {
            const {id, thumbnail, name} = char;
            return (
                <li key={id} tabIndex={0}  
                    className={`char__item${id === this.props.selectedChar ? " char__item_selected" : ""}`}
                    onClick={()=>this.props.onSelectedChar(id)} 
                    onKeyDown={(event)=>this.handleKeyDown(event, id)}>
                    <img src={thumbnail} style={{objectFit: thumbnail.includes('image_not_available') || thumbnail.includes('.gif') ? 'fill': 'cover'}} alt={name} />
                    <div className="char__name">{name}</div>
                 </li>
            )
        })

        const spinner = loading ? <Spinner /> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        const content = !(loading || error) ? [charCards] : null;

        return (
            <div className="char__list">
                <ul className="char__grid">
                    {spinner}
                    {errorMessage}
                    {content}
                </ul>
                <button 
                    className="button button__main button__long"
                    disabled={newItemsLoading}
                    style={{'display': charsEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">{newItemsLoading ? 'loading...' : 'load more'}</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onSelectedChar: PropTypes.func.isRequired
}

export default CharList;