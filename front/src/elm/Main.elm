module Main exposing (main)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)


type alias Model =
    {}


type Msg
    = None


init : () -> ( Model, Cmd Msg )
init =
    \_ -> ( {}, Cmd.none )


update msg model =
    ( model, Cmd.none )


view : Model -> Html Msg
view model =
    div [ class "container" ]
        [ h2 [ class "text-center" ] [ text "Chuck Norris Quotes" ]
        , p [ class "text-center" ]
            [ button [ class "btn btn-success" ] [ text "Grab a quote!" ]
            ]
        , blockquote []
            [ p [] []
            ]
        ]


main =
    Browser.element
        { init = init
        , subscriptions = \_ -> Sub.none
        , update = update
        , view = view
        }
