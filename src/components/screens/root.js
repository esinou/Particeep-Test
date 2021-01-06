import React from 'react';
import { movies$ } from '../../const/movies';

import { Icon, Dropdown, Pagination, Button } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import '../../App.css'

export default class Root extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            movies: [],
            moviesError: 0,
            likeToggle: true,
            options: [],
            selectedCategory: "",
            elemPerPage: 8
        }
    }
    componentDidMount() {
        movies$.then((value) => {
            this.setState({movies: value});
            if (this.state.movies && this.state.movies.length <= 0) {
                this.setState({moviesError: 1});
            } else {
                this.setState({moviesError: 2});
                this.setOptions();
                this.state.options.push({key: "All", text: "All category", value: ""});
            }
        });
    }
    howMuchAlreadyIn(array, category) {
        var isIn = 0;
        array.map((element, index) => {
            if (element.key === category) {
                isIn++;
            }
        })
        return (isIn);
    }
    howMuchCatAlreadyIn(array, category) {
        var isIn = 0;
        array.map((element, index) => {
            if (element.category === category) {
                isIn++;
            }
        })
        return (isIn);
    }
    setOptions() {
        this.state.movies.map((element, index) => {
            if (this.howMuchAlreadyIn(this.state.options, element.category) < 1) {
                this.state.options.push({key: element.category, text: element.category, value: element.category})
            }
        })
        this.setState({moviesError: 2});
    }
    updateOptions(category) {
        console.log("je suppr un film de categ " + category);
        if (this.howMuchCatAlreadyIn(this.state.movies, category) < 1) {
            this.state.options.map((element, index) => {
                if (element.key == category) {
                    this.state.options.splice(index, 1);
                }
            })
        }
    }
    deleteThisMovie(index) {
        var filmCategory = this.state.movies[index].category;

        this.state.movies.splice(index, 1);
        this.updateOptions(filmCategory);
        this.setState({moviesError: 2});

    }
    toggleLike = () => this.setState({likeToggle: !this.state.likeToggle});
    changeElemPerPage = (nb) => this.setState({elemPerPage: nb});
    renderMovies() {
        return (
            <div>
                <div className="Header">
                    <div className="HeaderTitle">
                        <p>Particeep | react-interview</p>
                    </div>
                </div>
                <div className="Select">
                    <div className="SelectOption">
                        <Dropdown
                            placeholder='Selectionner une catégorie'
                            fluid
                            selection
                            onChange={(e, data) => this.setState({selectedCategory: data.value})}
                            options={this.state.options}
                        />
                    </div>
                    <div className="SelectOption">
                        <div className="LikeButtonDiv" onClick={() => this.toggleLike()}>
                            <Icon name='like' color="black" />
                        </div>
                        <p>Afficher les barres de réactions</p>
                    </div>
                    <div className="SelectOption">
                        <div className="SelectOptionButtons">
                            <p>Elements affichés par page</p>
                        </div>
                        <div className="SelectOptionButtons">
                            <Button onClick={() => this.changeElemPerPage(4)}>4</Button>
                            <Button onClick={() => this.changeElemPerPage(6)}>6</Button>
                            <Button onClick={() => this.changeElemPerPage(8)}>8</Button>
                        </div>
                    </div>
                </div>
                <div className="GlobalDiv">
                    {this.state.movies.map((element, index) =>
                        this.state.selectedCategory === "" ? 
                        <div className="MovieDiv" key={index}>
                            <div className="MoviePoster"/>
                            <p className="MovieTitle">
                                {element.title}
                            </p>
                            {this.state.likeToggle === true ?
                                <div style={{backgroundColor: 'gray', flex: 1, width: '90%', height: '5px', display: 'flex', flexDirection: 'row'}}>
                                    <div style={{backgroundColor: 'green', flex: element.likes, width: '100%', height: '5px'}}></div>
                                    <div style={{backgroundColor: 'red', flex: element.dislikes, width: '100%', height: '5px'}}></div>
                                </div>
                                :
                                <div/>
                            }
                            <Icon name='trash alternate' color="red" onClick={() => this.deleteThisMovie(index)} />
                        </div>
                        :
                        this.state.selectedCategory == element.category ?
                        <div className="MovieDiv" key={index}>
                            <div className="MoviePoster"/>
                            <p className="MovieTitle">
                                {element.title}
                            </p>
                            {this.state.likeToggle === true ?
                                <div style={{backgroundColor: 'gray', flex: 1, width: '90%', height: '5px', display: 'flex', flexDirection: 'row'}}>
                                    <div style={{backgroundColor: 'green', flex: element.likes, width: '100%', height: '5px'}}></div>
                                    <div style={{backgroundColor: 'red', flex: element.dislikes, width: '100%', height: '5px'}}></div>
                                </div>
                                :
                                <div/>
                            }
                            <Icon name='trash alternate' color="red" onClick={() => this.deleteThisMovie(index)} />
                        </div>
                        :
                        <div key={index}/>
                    )}
                </div>
                <div className="Select">
                    <Pagination defaultActivePage={1} totalPages={4} />
                </div>
            </div>
        );
    }
    renderError() {
        return (
            <div className="GlobalDiv">
                <Icon loading name='spinner' />
            </div>
        );
    }
    render() {
        if (this.state.moviesError === 1) {
            return (
                this.renderError()
            );    
        } else if (this.state.moviesError === 2) {
            return (
                this.renderMovies()
            );
        }
        return (
            <div className="GlobalDiv">
                <Icon loading name='spinner' />
            </div>
        )
    }
}
