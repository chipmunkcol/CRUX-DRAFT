import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import crewSlice, {
  getCrewDetail,
  joinCrew,
  deleteCrew,
} from "../../Redux/modules/crewSlice";
import { likeCrew, withdrawCrew } from "../../Redux/modules/userSlice";
import Navbar from "../../Shared/Navbar";
import CrewIntro from "./components/CrewIntro";
import CrewMember from "./components/CrewMember";
import CrewNotice from "./components/CrewNotice";
import CrewPhotos from "./components/CrewPhotos";
import ApplicationListModal from "./components/ApplicationListModal";
import { ReactComponent as Heart } from "../../Image/heart.svg";

const CrewDetail = () => {
  const params = useParams().crewId;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCrewDetail(params));
  }, [dispatch]);

  const crewDetail = useSelector((state) => state?.crews?.crewDetail);
  console.log(crewDetail);
  const crew = crewDetail?.data;
  console.log(crew);

  //호스트 확인
  const hostId = crew?.memberList[0]?.id;
  const userId = window.localStorage.getItem("userId");

  //크루 가입자 확인
  const memberList = crew?.memberList;
  const checkmember = memberList?.findIndex((x) => x?.id === Number(userId));
  console.log(checkmember);

  //크루 삭제
  const onCrewDelte = () => {
    if (window.confirm("삭제하시겠습니까?")) {
      dispatch(deleteCrew(crew?.id));
    } else {
      return;
    }
  };

  //크루 탈퇴
  const handleWithDrawCrew = () => {
    if (window.confirm("삭제하시겠습니까?")) {
      const payload = {
        id: params,
        memberId: userId,
      };
      dispatch(withdrawCrew(payload));
    } else {
      return;
    }
  };

  //크루 수정
  const onCrewEdit = () => {
    if (window.confirm("수정하시겠습니까?")) {
      navigate(`/crewedit/${params}`, {
        state: {
          id: crew?.id,
          name: crew?.name,
          content: crew?.content,
          imgURL: crew?.imgUrl,
        },
      });
    } else {
      return;
    }
  };

  //탭 보이게 하기
  const [introVisible, setIntroVisible] = useState(true);
  const [memberVisible, setMemberVisible] = useState(false);
  const [noticeVisible, setNoticeVisible] = useState(false);
  const [photosVisible, setPhotosVisible] = useState(false);

  const handleIntro = () => {
    setIntroVisible(true);
    setMemberVisible(false);
    setNoticeVisible(false);
    setPhotosVisible(false);
  };

  const handleMember = () => {
    setMemberVisible(true);
    setIntroVisible(false);
    setNoticeVisible(false);
    setPhotosVisible(false);
  };

  const handleNotice = () => {
    setMemberVisible(false);
    setIntroVisible(false);
    setNoticeVisible(true);
    setPhotosVisible(false);
  };

  const handlePhotos = () => {
    setMemberVisible(false);
    setIntroVisible(false);
    setNoticeVisible(false);
    setPhotosVisible(true);
  };

  //크루 신청 리스트 모달 띄우기
  const [applicationModalVisible, setapplicationModalVisible] = useState(false);

  const handleMadalClick = () => {
    setapplicationModalVisible(!applicationModalVisible);
  };

  //하트클릭이벤트 | 만약 하트fill 또는 어쩌고가 true면,
  const [heartFillClick, setHeartFillClick] = useState(false);

  //클릭하면 하트필 true로 만들어둠
  const handleHeartFill = () => {
    setHeartFillClick(!heartFillClick);
    dispatch(likeCrew(crew?.id));
  };

  return (
    <div>
      <Navbar />
      <Warp>
        {applicationModalVisible && (
          <ApplicationListModal onClose={handleMadalClick} />
        )}
        <ThumbnailContainer>
          <ThumbnailContentBox>
            <ImgBox>
              <HeartIcon type="button">
                <Heart
                  width="50px"
                  height="50px"
                  fill="#000000"
                  onClick={handleHeartFill}
                  opacity={heartFillClick ? "80%" : "30%"}
                />
              </HeartIcon>
              <img src={crewDetail?.data?.imgUrl} />
            </ImgBox>
            <ContentBox>
              <TextBox>
                {hostId === Number(userId) ? (
                  <TextButton>
                    <span type="button" onClick={onCrewEdit}>
                      수정
                    </span>
                    <span type="button" onClick={onCrewDelte}>
                      삭제
                    </span>
                  </TextButton>
                ) : null}
                <h1>{crewDetail?.data?.name}</h1>
                <TextDetail>
                  <Text>
                    <p>참여자</p> <p>{crewDetail?.data?.crewNum}명</p>
                  </Text>
                  <Text>
                    <p>크루소개</p>
                    <p>{crewDetail?.data?.content}</p>
                  </Text>
                </TextDetail>
              </TextBox>
              {checkmember < 0 ? (
                <ButtonBox>
                  <button
                    onClick={() => {
                      dispatch(joinCrew(crew?.id));
                    }}
                  >
                    크루 가입
                  </button>
                </ButtonBox>
              ) : checkmember === 0 ? (
                <ButtonBox>
                  <button
                    onClick={() => {
                      dispatch(joinCrew(crew?.id));
                    }}
                  >
                    모임 공지
                  </button>
                  <button onClick={handleMadalClick}>신청 현황</button>
                </ButtonBox>
              ) : (
                <ButtonBox>
                  <button
                    onClick={() => {
                      dispatch(joinCrew(crew?.id));
                    }}
                  >
                    모임 공지
                  </button>
                  <button onClick={handleWithDrawCrew}>크루 탈퇴</button>
                </ButtonBox>
              )}
            </ContentBox>
          </ThumbnailContentBox>
          <TabButton>
            <span type="button" onClick={handleIntro}>
              소개
            </span>
            <span type="button" onClick={handleMember}>
              참여멤버
            </span>
            <span type="button" onClick={handleNotice}>
              모임공지
            </span>
            <span type="button" onClick={handlePhotos}>
              사진첩
            </span>
          </TabButton>
        </ThumbnailContainer>
        <TabContainer>
          {introVisible && (
            <CrewIntro
              content={crewDetail?.data?.content}
              adminNickname={crew?.memberList[0]?.nickname}
              adminContent={crew?.memberList[0]?.content}
            />
          )}
          {memberVisible && <CrewMember members={[crew?.memberList]} />}
          {noticeVisible && <CrewNotice notice={crew?.noticeList} />}
          {photosVisible && <CrewPhotos />}
        </TabContainer>
      </Warp>
    </div>
  );
};

export default CrewDetail;

const Warp = styled.div`
  display: flex;
  flex-direction: column;
`;

const ThumbnailContainer = styled.div`
  width: 1920px;
  height: 815px;
  background-color: #202020;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;
  position: relative;
`;

const TabContainer = styled.div`
  width: 1920px;
  min-height: 864px;
  height: auto;
  background-color: #141414;
  display: flex;
  justify-content: center;
`;

const ThumbnailContentBox = styled.div`
  width: 1200px;
  height: 600px;
  display: flex;
  justify-content: space-between;
`;

const ImgBox = styled.div`
  width: 600px;
  height: 600px;
  background-color: green;
  img {
    width: 100%;
    height: 100%;
  }
  position: relative;
`;

const HeartIcon = styled.div`
  position: absolute;
  right: 30px;
  top: 26px;
`;

const ContentBox = styled.div`
  width: 550px;
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const TextBox = styled.div`
  width: 550px;
  height: 372px;
  h1 {
    color: #ffffff;
    font-family: "Spoqa Han Sans Neo";
    font-style: normal;
    font-weight: 700;
    font-size: 44px;
    letter-spacing: -0.05em;
  }
`;

const TextDetail = styled.div`
  width: 550px;
  height: 206px;
  margin-top: 76px;
`;

const Text = styled.div`
  display: flex;
  align-items: center;
  margin-botton: 14px;
  p {
    font-family: "Spoqa Han Sans Neo";
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    letter-spacing: -0.05em;
    color: #cccccc;
    &:nth-child(1) {
      color: #666666;
      font-size: 20px;
      margin-right: 20px;
    }
  }
`;

const TextButton = styled.div`
  width: 550px;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-family: "Spoqa Han Sans Neo";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  letter-spacing: -0.05em;
  span {
    border: none;
    color: #999999;
    margin-rignt: 6px;
    &:nth-child(1) {
      padding-right: 6px;
    }
    &:nth-child(2) {
      padding-left: 6px;
    }
  }
`;

const ButtonBox = styled.div`
  width: 550px;
  height: 60px;
  display: flex;
  justify-content: space-between;
  font-family: "Spoqa Han Sans Neo";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  letter-spacing: -0.05em;
  button {
    width: 250px;
    height: 60px;
    border: none;
    color: #666666;
    background-color: #999999;
    &:hover {
      color: #262626;
      background-color: #ffb800;
      transition: 0.5s;
    }
  }
`;

const TabButton = styled.div`
  margin-top: 80px;
  font-family: "Spoqa Han Sans Neo";
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  letter-spacing: -0.05em;
  color: #999999;
  position: absolute;
  left: 360px;
  bottom: 3px;
  span {
    &:nth-child(1) {
      padding-right: 40px;
      text-decoration: underline 2px;
      text-underline-offset: 8px;
    }
    &:nth-child(2) {
      padding-right: 40px;
      text-decoration: underline 2px;
      text-underline-offset: 8px;
    }
    &:nth-child(3) {
      padding-right: 40px;
      text-decoration: underline 2px;
      text-underline-offset: 8px;
    }
    &:nth-child(4) {
      text-decoration: underline 2px;
      text-underline-offset: 8px;
    }
    &:hover {
      color: #ffffff;
      transition: 0.5s;
    }
  }
`;
