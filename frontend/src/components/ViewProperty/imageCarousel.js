export const ImageCarousel = ({imgUrls}) => {
    return <>
        <div id="carouselPropertyImg" className="carousel slide carousel-fade" data-bs-ride="true">
            <CarouselIndicators numImgs={imgUrls.length} />
            <CarouselInner imgUrls={imgUrls}/>
            <CarouselControl />
        </div>
    </>
}

const CarouselItem = ({imgUrl}) => {
    return (
        <div className="carousel-item active">
            <img src={imgUrl} className="d-block w-100 rounded" alt="" />
        </div>
    );
}

const CarouselInner = ({imgUrls}) => {
    return (
        <div className="carousel-inner">
            {
                imgUrls.map((imgUrl, i) => {
                    return <CarouselItem imgUrl={imgUrl} key={i} />
                })
            }
        </div>
    );
}

const CarouselIndicators = ({numImgs}) => {
    return <>
        <div className="carousel-indicators">
            {
                [...Array(numImgs).keys()].map((_, i) => {
                    return <CarouselSlideTo slideNumber={i} isActive={true} key={i} />
                })
            }
        </div>
    </>
}

const CarouselSlideTo = ({slideNumber, isActive}) => {
    return <button type="button" data-bs-target="#carouselPropertyImg" data-bs-slide-to={slideNumber}
                className={ isActive === true ? "active" : "" } />
}

const CarouselControl = ({}) => {
    return <>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselPropertyImg"
                    data-bs-slide="prev">
            <span className="carousel-control-prev-icon"></span>
            <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselPropertyImg"
            data-bs-slide="next">
            <span className="carousel-control-next-icon"></span>
            <span className="visually-hidden">Next</span>
        </button>
    </>
}