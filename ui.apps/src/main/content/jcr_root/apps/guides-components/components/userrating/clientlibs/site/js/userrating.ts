/*******************************************************************************
 * Copyright 2022 Adobe Systems Incorporated
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

class UserRating {
  private protocol: string;
  private host: string;
  private pathName: string;

  // TODO: Need to remove below two once able to get user session or similar data. Remove global state also
  private rated: boolean = false;
  private ratedValue: number = 0;
  constructor() {
    this.protocol = window.location.protocol;
    this.host = window.location.host;
    this.pathName = window.location.pathname;
    this.rated = false;
    this.ratedValue = 0;
  }

  //TODO : Remove once figured out why svg code is not working. Update corressponding commented code also
  static currentRatingStarHighlighted = `<svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9.23901 0.295998L11.4 6.014L17.506 6.304C17.5578 6.30612 17.6077 6.32396 17.6491 6.35516C17.6905 6.38636 17.7214 6.42943 17.7377 6.47863C17.7539 6.52783 17.7549 6.58082 17.7403 6.63055C17.7257 6.68029 17.6963 6.72439 17.656 6.757L12.886 10.58L14.498 16.477C14.5116 16.5269 14.5096 16.5798 14.4924 16.6286C14.4752 16.6774 14.4435 16.7198 14.4016 16.7502C14.3598 16.7806 14.3096 16.7975 14.2579 16.7987C14.2061 16.7999 14.1553 16.7854 14.112 16.757L9 13.402L3.89 16.758C3.84667 16.7865 3.79565 16.8012 3.74378 16.8C3.6919 16.7987 3.64163 16.7817 3.59968 16.7512C3.55773 16.7206 3.5261 16.678 3.509 16.629C3.4919 16.58 3.49016 16.527 3.504 16.477L5.116 10.581L0.346004 6.758C0.305345 6.72549 0.275609 6.68131 0.260792 6.63141C0.245974 6.58151 0.246786 6.52826 0.263117 6.47883C0.279449 6.4294 0.310518 6.38616 0.352149 6.3549C0.393781 6.32365 0.443981 6.30588 0.496004 6.304L6.6 6.014L8.762 0.295998C8.78051 0.247892 8.81316 0.206523 8.85564 0.177344C8.89813 0.148165 8.94846 0.132545 9 0.132545C9.05155 0.132545 9.10188 0.148165 9.14437 0.177344C9.18685 0.206523 9.2195 0.247892 9.238 0.295998H9.23901Z" fill="#0265DC"/>
  </svg>`;
  static currentRatingStar = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9.03001 2.541L10.807 7.291L15.916 7.531L11.929 10.731L13.264 15.65L8.99701 12.866L4.71801 15.674L6.06801 10.737L2.08201 7.537L7.18201 7.293L9.03001 2.541ZM9.04001 0.411001C8.96403 0.409976 8.8896 0.432496 8.82693 0.475468C8.76426 0.51844 8.71643 0.579758 8.69001 0.651001L6.48501 6.326L0.385009 6.619C0.309043 6.6228 0.236027 6.6496 0.17565 6.69586C0.115274 6.74212 0.0703907 6.80564 0.0469576 6.878C0.0235245 6.95036 0.0226492 7.02814 0.0444478 7.10101C0.0662464 7.17388 0.109688 7.2384 0.169009 7.286L4.93001 11.106L3.31601 17.006C3.30062 17.0618 3.29831 17.1204 3.30927 17.1772C3.32023 17.234 3.34415 17.2875 3.37918 17.3336C3.41421 17.3797 3.4594 17.417 3.51123 17.4428C3.56307 17.4685 3.62014 17.4819 3.67801 17.482C3.75106 17.4817 3.82239 17.4598 3.88301 17.419L9.00001 14.061L14.093 17.385C14.1535 17.4252 14.2244 17.4467 14.297 17.447C14.3549 17.447 14.4119 17.4337 14.4638 17.4081C14.5157 17.3825 14.5609 17.3453 14.596 17.2993C14.6311 17.2534 14.6552 17.1999 14.6663 17.1431C14.6774 17.0864 14.6752 17.0278 14.66 16.972L13.065 11.106L17.83 7.28C17.8894 7.23234 17.9328 7.16773 17.9546 7.09478C17.9764 7.02182 17.9754 6.94396 17.9518 6.87156C17.9283 6.79917 17.8833 6.73565 17.8227 6.68946C17.7622 6.64328 17.6891 6.61661 17.613 6.613L11.513 6.326L9.39301 0.656001C9.3674 0.583556 9.31981 0.520913 9.25689 0.476813C9.19396 0.432713 9.11884 0.409356 9.04201 0.410001L9.04001 0.411001Z" fill="#464646"/>
  </svg>`;
  static newRatingStarUnselected = `<svg width="25" height="24" viewBox="0 0 25 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M15.4598 8.64441L15.5753 8.95257L15.904 8.96831L24.2791 9.36924L17.7365 14.6547L17.4828 14.8596L17.5682 15.1745L19.7779 23.3225L12.7753 18.6901L12.4993 18.5075L12.2234 18.6902L5.22338 23.3241L7.43352 15.1759L7.51891 14.8611L7.26516 14.6561L0.720945 9.36932L9.09483 8.96831L9.42349 8.95257L9.53906 8.64449L12.5001 0.750781L15.4598 8.64441Z" stroke="#222222"/>
  </svg>`;

  checkNull(inputValue) {
    const value = "";
    if (inputValue === null) {
      return value;
    } else {
      return inputValue;
    }
  }

  createRatingStar(selected: boolean) {
    const div = document.createElement("div");
    div.classList.add("cmp-userrating-stars");
    //const svg = document.createElement("iframe");
    //svg.classList.add("cmp-userrating-stars-svg");
    if (selected) {
      div.innerHTML = UserRating.currentRatingStarHighlighted;
      //svg.setAttribute("src", "./resources/current-rating-star-highlighted.svg");
    }
    else {
      div.innerHTML = UserRating.currentRatingStar;
      //svg.setAttribute("src", "./resources/current-rating-star.svg");
    }
    //div.appendChild(svg);
    return div;
  }

  createRatingStarGroup(rating: string) {
    const div = document.createElement("div");
    div.classList.add("cmp-userrating-stars-group");
    for (let i = 0; i < 5; i++) {
      let star: HTMLDivElement;
      if (i + 1 < parseFloat(rating)) {
        star = this.createRatingStar(true);
      } else {
        star = this.createRatingStar(false);
      }
      div.appendChild(star);
    }
    return div;
  }

  createVerticalDivider() {
    const div = document.createElement("div");
    div.classList.add("cmp-userrating-vertical-divider");
    return div;
  }

  createUserCountParagraph(count: string) {
    const div = document.createElement("div");
    div.classList.add("cmp-userrating-total-reviews");
    div.innerHTML = "(" + count + " ratings)";
    return div;
  }

  createAverageRatingParagraph(rating: string) {
    const div = document.createElement("div");
    div.classList.add("cmp-userrating-average-rating");
    div.innerHTML = parseFloat(rating) + " / 5";
    return div;
  }

  createRatingGroup(rating: string, count: string) {
    const div = document.createElement("div");
    div.classList.add("cmp-userrating-rating-group");

    const starGroup = this.createRatingStarGroup(rating);
    div.appendChild(starGroup);

    const verticalDivider = this.createVerticalDivider();
    div.appendChild(verticalDivider);

    const averageRatingParagraph = this.createAverageRatingParagraph(rating);
    div.appendChild(averageRatingParagraph);

    const userCountParagraph = this.createUserCountParagraph(count);
    div.appendChild(userCountParagraph);

    const ratingPopup = this.createRatePopup();
    div.appendChild(ratingPopup);

    div.onpointerenter = () => {
      ratingPopup.classList.toggle("cmp-userrating-popup-show", true);
    };
    div.onpointerleave = () => {
      ratingPopup.classList.toggle("cmp-userrating-popup-show", false);
    };
    return div;
  }

  createRatePopup() {
    const div = document.createElement("div");
    div.classList.add("cmp-userrating-popup");

    const rateText = this.createRateText();
    div.appendChild(rateText);
    const rateStarGroup = this.createRateStarGroup(() => {
      rateText.replaceWith(this.createRateText());
      rateStarGroup.replaceWith(this.createRateStarGroup(() => {}));
    });
    div.appendChild(rateStarGroup);
    return div;
  }

  createRateText() {
    const div = document.createElement("div");
    div.classList.add("cmp-userrating-popup-text");
    if (this.rated) {
      div.innerHTML = "Thank you for the rating";
    } else {
      div.innerHTML = "Rate this content";
    }
    return div;
  }

  createRateStarGroup(updateFunc) {
    const frame = document.createElement("div");
    frame.classList.add("cmp-userrating-popup-star-frame");
    const div = document.createElement("div");
    div.classList.add("cmp-userrating-popup-star-group");
    for (let i = 0; i < 5; i++) {
      let star: HTMLDivElement;
      let last = (i === 4); //Remove padding from last star
      if (i < this.ratedValue) {
        star = this.createRateStar("selected", last);
      } else {
        star = this.createRateStar("unselected", last);
      }
      if (!this.rated) {
        star.addEventListener("pointerenter", function starpointerenter() {
          const starlist = div.querySelectorAll(".cmp-userrating-popup-star") as NodeListOf<HTMLDivElement>;
          for (let j = 0; j <= i; j++) {
            const svgNode = starlist[j].querySelector(".cmp-userrating-popup-star-svg-fill-unselected")
            svgNode.classList.toggle("cmp-userrating-popup-star-svg-fill-unselected", false);
            svgNode.classList.toggle("cmp-userrating-popup-star-svg-fill-hover", true);
          }
        });
        star.addEventListener("pointerleave" , function starpointerleave() {
          const starlist = div.querySelectorAll(".cmp-userrating-popup-star") as NodeListOf<HTMLDivElement>;
          for (let j = 0; j <= i; j++) {
            const svgNode = starlist[j].querySelector(".cmp-userrating-popup-star-svg-fill-hover")
            svgNode.classList.toggle("cmp-userrating-popup-star-svg-fill-hover", false);
            svgNode.classList.toggle("cmp-userrating-popup-star-svg-fill-unselected", true);
          }
        });
        star.addEventListener("click", function starclick(event: MouseEvent) {
          this.rated = true;
          this.ratedValue = parseInt((event.currentTarget as HTMLDivElement).getAttribute("data-rating"));
          //guidesAnalytics.sendRating(this.ratedValue);
          updateFunc();
        }.bind(this));
      }
      star.setAttribute("data-rating", (i + 1).toString());
      div.appendChild(star);
    }
    frame.appendChild(div);
    return frame;
  }

  createRateStar(state: "selected" | "unselected" | "hover", last: boolean) {
    const div = document.createElement("div");
    div.classList.add("cmp-userrating-popup-star");
    if(last) div.classList.add("cmp-userrating-popup-last-star");
    //const svg = document.createElement("iframe");
    const svg = document.createElement("div");
    svg.classList.add("cmp-userrating-popup-star-svg");
    svg.innerHTML = UserRating.newRatingStarUnselected;
    if (state === "selected") {
      svg.classList.toggle("cmp-userrating-popup-star-svg-fill-selected", true);
      //svg.setAttribute("src", "./resources/new-rating-star-selected.svg");
    }
    else if( state === "hover") {
      svg.classList.toggle("cmp-userrating-popup-star-svg-fill-hover", true);
      //svg.setAttribute("src", "./resources/new-rating-star-hover.svg");
    }
    else {
      svg.classList.toggle("cmp-userrating-popup-star-svg-fill-unselected", true);
      //svg.setAttribute("src", "./resources/new-rating-star-unselected.svg");
    }
    div.appendChild(svg);
    return div;
  }

  displayRating(parent: Element, rating: string, count: string) {
    const ratingDiv = parent.querySelector(".cmp-userrating") as HTMLDivElement;
    const ratingParagraph = document.createElement("div");
    ratingParagraph.classList.add("cmp-userrating-rating-paragraph");
    ratingParagraph.innerHTML = "Rating";
    ratingDiv.appendChild(ratingParagraph);

    const ratingGroup = this.createRatingGroup(rating, count);
    ratingDiv.appendChild(ratingGroup);
  }

  onDocumentReady() {
    const ratingDivs = document.querySelectorAll(".userrating");
    ratingDivs.forEach((div) => {
      //TODO: send the data to analytics api once api is ready
      let topicUuid = div.getAttribute("data-cmp-topic-uuid");
      let rootMapUuid = div.getAttribute("data-cmp-root-map-uuid");
      let sitePublishPath = div.getAttribute("data-cmp-site-publish-path");
      /*
      guidesAnalytics.setUniqueIdentifiers(topicUuid, rootMapUuid, sitePublishPath);
      const ratingData = guidesAnalytics.getRatingData();
      ratingData.then((data) => {
        data = data ? data : {"Average Rating": 0, "Total Rating Count": "0"};
        this.displayRating(div, 
          data["Average Rating"] ? data["Average Rating"].toFixed(2) : (0 as number).toFixed(2), 
        data["Total Rating Count"] ? data["Total Rating Count"] : "0");
      });
      */
     this.displayRating(div, "4.2", "31");
    });
  }
}

const userRating = new UserRating();
document.addEventListener(
  "DOMContentLoaded",
  userRating.onDocumentReady.bind(userRating)
);
