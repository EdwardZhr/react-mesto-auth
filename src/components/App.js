import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import React from 'react';
import api from '../utils/Api';
import CurrentUserContext from '../contexts/CurrentUserContext';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';


function App() {

    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [selectedCard,  setSelectedCard] = React.useState({name: '', link: ''});
    const [currentUser,  setCurrentUser] = React.useState({about: '', avatar: '', cohort: '', name: '', _id: ''});
    const [cards, setCards] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        api.getProfile()
        .then((profileData)=>{ 
            setCurrentUser(profileData);
      })
        .catch((err)=>{ 
          console.log(err);
      });
  
      }, [])
      
      React.useEffect(() => {
        api.getInitialCards()
        .then((initialCards)=>{
  
          setCards(initialCards);
      })
        .catch((err)=>{ 
          console.log(err);
      });
  
      }, [])

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true)
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true)
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true)
    }

    function closeAllPopups() {
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setSelectedCard({name: '', link: ''})
    }

    const isOpen = isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || selectedCard.link

    React.useEffect(() => {
      function closeByEscape(evt) {
        if(evt.key === 'Escape') {
          closeAllPopups();
        }
      }
      if(isOpen) {
        document.addEventListener('keydown', closeByEscape);
            return () => {
            document.removeEventListener('keydown', closeByEscape);
        }
      }
    }, [isOpen]) 
  

    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        api.changeLikeCardStatus(card._id, isLiked).then((newCard)=>{
            setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch((err)=>{ 
            console.log(err);
        });
    }

    function handleCardDelete(card) {
        api.deleteCard(card._id).then(()=>{
            setCards((state) => state.filter((c) => c._id !== card._id))
        })
        .catch((err)=>{ 
            console.log(err);
        });
    }

    function handleUpdateUser(info) {
        setIsLoading(true);
        api.editProfile(info).then((newInfo)=>{
            setCurrentUser(newInfo);
            closeAllPopups()
        })
        .catch((err)=>{ 
            console.log(err);
        })
        .finally(()=>{
            setIsLoading(false);
        })
    }

    function handleUpdateAvatar(info) {
        setIsLoading(true);
        api.changeAvatar(info.avatar).then((newInfo)=>{
            setCurrentUser(newInfo);
            closeAllPopups()
        })
        .catch((err)=>{ 
            console.log(err);
        })
        .finally(()=>{
            setIsLoading(false);
        })
    }

    function handleAddPlace(card) {
        setIsLoading(true);
        api.addCard(card).then((newCard)=>{
            setCards([newCard, ...cards])
            closeAllPopups()
        })
        .catch((err)=>{ 
            console.log(err);
        })
        .finally(()=>{
            setIsLoading(false);
        })
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="body">
                <div className="page">
                    <Header />
                    <Main cards={cards} onCardDelete={handleCardDelete} onCardClick={setSelectedCard} onCardLike={handleCardLike} onEditProfile={handleEditProfileClick} onAddPlace={handleAddPlaceClick} onEditAvatar={handleEditAvatarClick}/>
                    <Footer />

                    <EditProfilePopup isLoading={isLoading} isOpen={isEditProfilePopupOpen} onUpdateUser={handleUpdateUser} onClose={closeAllPopups}></EditProfilePopup>

                    <EditAvatarPopup isLoading={isLoading} isOpen={isEditAvatarPopupOpen} onUpdateAvatar={handleUpdateAvatar} onClose={closeAllPopups}></EditAvatarPopup>

                    <AddPlacePopup isLoading={isLoading} isOpen={isAddPlacePopupOpen} onAddPlace={handleAddPlace} onClose={closeAllPopups}></AddPlacePopup>

                    <PopupWithForm name='delete' title='Вы уверены?' buttonText='Да'/>

                    <ImagePopup card={selectedCard} onClose={closeAllPopups} />
                </div>
            </div>
        </CurrentUserContext.Provider>
  );
}

export default App;