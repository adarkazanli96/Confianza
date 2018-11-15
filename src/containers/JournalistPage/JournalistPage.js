import React, { Component } from 'react'
import Logo from '../../components/Logo/Logo'
import JournalistIcon from '../../components/JournalistIcon/JournalistIcon'
import Rating from '../../components/Rating/Rating'
import Reviews from '../../components/Reviews/Reviews'
import SearchBar from '../../components/SearchBar/SearchBar'
import Navbar from '../../components/Navbar/Navbar'
import styles from './JournalistPage.module.css'
import Modal from '../../components/Modal/Modal'
import NewReview from '../../components/NewReview/NewReview'
import StarRatingComponent from 'react-star-rating-component';
import axios from '../../axios-orders'

class JournalistPage extends Component {
    constructor(props) {
        super(props)
        this.state = {

            // arraylist of existing reviews
            reviews: [],

            // object for posting a new review
            newReview: {
                comment: "",
                headline: "",
                rating: 0
            },

            starHover: true,

            //indicates whether a new review is in the process of being written
            writingReview: false,

            theResponse: "",

            averageRating: 0
        }
    }

    onStarClick(nextValue, prevValue, name) {
        //this.setState({ rating: nextValue, starHover: false });

        this.setState({
            newReview: {
                ...this.state.newReview,
                rating: nextValue
            },
            starHover: false
        })
    }

    onStarHover(nextValue, prevValue, name) {
        if (this.state.starHover == true) {
            //this.setState({ rating: nextValue });
            this.setState({
                newReview: {
                    ...this.state.newReview,
                    rating: nextValue
                },
            })
        }
    }

    onStarHoverOut(nextValue, prevValue, name) {
        if (this.state.starHover == true) {
            //this.setState({ rating: 0 });
            this.setState({
                newReview: {
                    ...this.state.newReview,
                    rating: 0
                },
            })
        }
    }

    // new review is being written
    writeReviewHandler = () => {
        this.setState({ writingReview: true })
    }

    // cancel the new review
    cancelReviewHandler = () => {
        this.setState({ writingReview: false })

        //clear the headline and comment fields for the new review
        this.setState({
            newReview: {
                ...this.state.newReview,
                comment: "",
                headline: "",
                rating: 0
            },
            starHover: true
        })

        /*let r = Object.assign({}, this.state.newReview);    //creating copy of object
        r.comment = "";
        r.headline = "";
        this.setState({ newReview: r })*/
    }

    // set the value of the new comment to comment input field
    setCommentHandler = (event) => {
        this.setState({
            newReview: {
                ...this.state.newReview,
                comment: event.target.value,
            }
        })

        /*let r = Object.assign({}, this.state.newReview);    //creating copy of object
        r.comment = event.target.value;                        //updating value
        this.setState({ newReview: r });*/
    }

    // set the value of the new headline to headline input field
    setHeadlineHandler = (event) => {
        this.setState({
            newReview: {
                ...this.state.newReview,
                headline: event.target.value,
            }
        })

        /*let r = Object.assign({}, this.state.newReview);    //creating copy of object
        r.headline = event.target.value;                        //updating value
        this.setState({ newReview: r });*/
    }

    // posts new review to database and updates view
    submitReviewHandler = async () => {

        const review = {
            rating: this.state.newReview.rating,
            headline: this.state.newReview.headline,
            comment: this.state.newReview.comment
        }

        // post new review to database
        await axios.post('reviews.json', review)
            .then(response => console.log(response))
            .catch(error => console.log(error));

        // get data from database to update view
        axios.get('https://confianza-f74d4.firebaseio.com/reviews.json')
            .then(response => {
                this.setState({ reviews: Object.values(response.data) });
                this.calculateAverageRating();
            })

       
    }

    calculateAverageRating = () => {
        let sum = 0;
        let counter = 0;

        let ratings = this.state.reviews.map(review => review.rating);
        for (var i = 0; i < ratings.length; i++) {
            sum += ratings[i];
            counter++
        }

        let average = sum / counter;

        this.setState({averageRating: average});
    }

    // retrieves arraylist of reviews from database as soon as component mounts
    componentDidMount() {
        axios.get('https://confianza-f74d4.firebaseio.com/reviews.json')
            .then(response => {
                this.setState({ reviews: Object.values(response.data) })
                this.calculateAverageRating();
            })

            
    }


    render() {

        /*const { reviews } = this.state
    console.log(reviews)*/

        return (
            <div>
                <Modal
                    show={this.state.writingReview}
                    modalClosed={this.cancelReviewHandler}>
                    <NewReview
                        reviewCancelled={this.cancelReviewHandler}
                        reviewSubmitted={this.submitReviewHandler}
                        headlineChange={(event) => this.setHeadlineHandler(event)}
                        headlineValue={this.state.newReview.headline}
                        commentChange={(event) => this.setCommentHandler(event)}
                        commentValue={this.state.newReview.comment}>
                        <StarRatingComponent
                            className={styles['star']}
                            name="rate"
                            starCount={5}
                            value={this.state.newReview.rating}
                            onStarClick={this.onStarClick.bind(this)}
                            onStarHover={this.onStarHover.bind(this)}
                            onStarHoverOut={this.onStarHoverOut.bind(this)}
                            emptyStarColor={"#808080"}
                            renderStarIcon={() => <span>⭑</span>}
                        />

                    </NewReview>
                </Modal>
                <Navbar />
                <JournalistIcon />
                <Rating rating = {this.state.averageRating}/>

                <Reviews reviews={this.state.reviews} />

                <button
                    className={styles['write-new-review-button']}
                    onClick={this.writeReviewHandler}>
                    WRITE REVIEW
                </button>

                {/*
                    reviews.map(review => <div>{review.comment}</div>)
                }*/}

            </div>
        );
    }
}

export default JournalistPage;