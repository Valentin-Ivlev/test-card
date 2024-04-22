<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Форма оплаты</title>
    @vite(['resources/scss/app.scss', 'resources/js/app.jsx'])
    <style>
        .card-container {
            width: 340px;
            height: 312px;
            position: relative;
        }
        .card-front {
            width: 340px;
            height: 212px;
            background-image: url("/card-front.svg");
            background-size: cover;
            color: white;
            padding: 20px;
            padding-top: 55px;
            border-radius: 15px;
            position: absolute;
            left: 0;
        }
        .card-back {
            width: 340px;
            height: 140px;
            background-image: url("/card-back.svg");
            background-size: cover;
            background-position: right;
            color: black;
            padding: 20px;
            padding-top: 55px;
            border-bottom-left-radius: 15px;
            border-bottom-right-radius: 15px;
            position: absolute;
            bottom: 0;
            right: 0;
        }
        @media (min-width: 767px) {
            .card-container {
                width: 510px;
                height: 212px;
                position: relative;
            }
            .card-front {
                width: 340px;
                height: 212px;
                background-image: url("/card-front.svg");
                background-size: cover;
                color: white;
                padding: 20px;
                padding-top: 55px;
                border-radius: 15px;
                position: absolute;
                left: 0;
            }
            .card-back {
                width: 190px;
                height: 212px;
                background-image: url("/card-back.svg");
                background-size: cover;
                background-position: right;
                color: black;
                padding: 20px;
                padding-top: 70px;
                padding-left: 60px;
                border-top-right-radius: 15px;
                border-bottom-right-radius: 15px;
                position: absolute;
                right: 20px;
            }
        }
        .card-btn {
            width: 110px;
            height: 75px;
            cursor: pointer;
            font-size: .9em !important;
            line-height: 1.1em !important;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #F2F2F5;
            color: #333;
            padding: 10px 10px 0;
        }
        .card-btn.saved-card {
            text-align: left;
            padding-top: 32px;
            background-color: #6698FA;
            color: #fff;
        }
        .plus {
            font-size: 2.5em;
            line-height: 1em
        }
        .font-065em {
            font-size: .65em;
        }
        .font-085em {
            font-size: .85em;
        }
    </style>
</head>
<body>
    <div id="app"></div>
</body>
</html>
