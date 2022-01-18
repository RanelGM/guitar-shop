
import { Comment } from 'types/product';

type ReviewProps = {
  review: Comment
}

function Review({ review }: ReviewProps): JSX.Element {
  const { id, userName, advantage, disadvantage, comment, rating, createAt } = review;

  const adaptedDate = new Date(createAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  const stars = Array.from({ length: rating }, (item, index) => index);

  return (
    <div className="review">
      <div className="review__wrapper">
        <h4 className="review__title review__title--author title title--lesser">{userName}</h4>
        <span className="review__date">{adaptedDate}</span>
      </div>
      <div className="rate review__rating-panel" aria-hidden="true"><span className="visually-hidden">Рейтинг:</span>
        {stars.map((star) => (
          <svg key={`rating-${id}-${star}`} width="16" height="16" aria-hidden="true">
            <use xlinkHref="#icon-full-star"></use>
          </svg>
        ))}

        <span className="rate__count"></span><span className="rate__message"></span>
      </div>
      <h4 className="review__title title title--lesser">Достоинства:</h4>
      <p className="review__value">{advantage}</p>
      <h4 className="review__title title title--lesser">Недостатки:</h4>
      <p className="review__value">{disadvantage}</p>
      <h4 className="review__title title title--lesser">Комментарий:</h4>
      <p className="review__value">{comment}</p>
    </div>
  );
}

export default Review;
