import { Component } from 'react';
import PropTypes from 'prop-types'
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton'
import './charInfo.scss';

class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false,
      };
    
    marvelService = new MarvelService();

    componentDidMount() {
        this.onUpdateChar();
    }

    componentDidUpdate(prevProps) {
        if (this.props.charId !== prevProps.charId) {
            this.onUpdateChar();
        }
    }

    onUpdateChar = () => {
        const {charId} = this.props
        if (!charId) {
            return;
        }
        
        this.onCharLoading();
        this.marvelService.getCharacter(charId)
                          .then(this.onCharLoaded)
                          .catch(this.onError)
    }

    onCharLoaded = (char) => {
        this.setState({ char, loading: false, error: false });
      };
    
    onCharLoading = () => {
        this.setState({ loading: true })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true,
        });
    };
    

    render() {
        const {char, loading, error} = this.state;

        const skeleton = char || loading || error ? null : <Skeleton/>;
        const spinner = loading ? <Spinner /> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        const content = !(loading || error || !char) ? <View char={char}/> : null;


        return (
            <div className="char__info">
                {skeleton}
                {spinner}
                {errorMessage}
                {content}
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics, comicsAmount} = char;
    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} style={{objectFit: thumbnail.includes('image_not_available') || thumbnail.includes('.gif') ? 'fill' : 'cover'}} alt={name}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">{comicsAmount > 10 ? `Part of the ${comicsAmount} available comics:` : `Amount of comics available: ${comicsAmount}`}</div>
            <ul className="char__comics-list">
                {   
                    comics.length > 0 ?
                    comics.slice(0, 10).map((item, i) => {
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li> 
                        )
                    }) : 'There is no comics with this character'
                }
            </ul>
        </>
        
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;