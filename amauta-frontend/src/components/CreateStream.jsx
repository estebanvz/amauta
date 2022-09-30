import React, { useCallback, useEffect, useState } from "react";
import { Context } from "../config/context";
import Blockies from "react-blockies";
import moment from "moment";
import BigNumber from "bignumber.js";
import { FaLink } from "react-icons/fa";
const ERC20_DECIMALS = 18;
export default function CreateStream() {
  const [myStreams, setMyStreams] = useState([]);
  const {
    kit,
    web3,
    contract,
    walletState,
    cCUSD,
    update,
    setUpdate,
    MPContract,
    setWalletState,
    setContract,
    connectWallet,
  } = React.useContext(Context);
  const [loading, setloading] = useState(false);
  const callMyStreams = async () => {
    let tmpMyStreams = await contract.methods.getMyStreams().call();
    // let tmpMyStreams = [0, 1];
    console.log(tmpMyStreams);
    let tmp = [];
    for (const e of tmpMyStreams) {
      const stream = await contract.methods.readStream(e).call();

      tmp.push({ ...stream, id: e });
    }
    console.log(" RUN");
    console.log(tmp);
    setMyStreams(tmp);
  };
  const [currentStream, setCurrentStream] = React.useState({
    name: "",
    image: "https://picsum.photos/250/350",
    description: "",
    date: "",
    link: "#",
    price: 0.5,
    limit_people: 10,
  });
  const [open, useOpen] = React.useState(false);

  useEffect(() => {
    // const getMyStream = async () => {};
    if (contract) {
      callMyStreams();
    }
  }, [contract, update]);

  const setInputValue = (e) => {
    let tmp = { ...currentStream };
    tmp[e.target.name] = e.target.value;
    setCurrentStream(tmp);
  };
  const openStream = () => {
    window.open(currentStream.link);
  };
  const getLink = async (id) => {
    const link = await contract.methods.getHiddenLink(id).call();
    window.open(link);
  };
  const createStream = async () => {
    setloading(true);

    let tmp = { ...currentStream };
    if (
      tmp.name &&
      tmp.date &&
      tmp.description &&
      tmp.image &&
      tmp.limit_people &&
      tmp.link &&
      tmp.price
    ) {
      try {
        const tmpdate = moment(tmp.date).toString();

        let tmpMyStreams = await contract.methods
          .writeProduct(
            tmp.name,
            tmp.image,
            tmp.description,
            tmpdate,
            tmp.link,
            new BigNumber(tmp.price).shiftedBy(ERC20_DECIMALS).toString(),
            tmp.limit_people
          )
          .send({ from: kit.defaultAccount });
        console.log(tmp);
        useOpen(false);
        setCurrentStream({
          name: "",
          image: "https://picsum.photos/250/350",
          description: "",
          date: "",
          link: "#",
          price: 0.5,
          limit_people: 10,
        });
        setUpdate(update + 1);
      } catch (error) {
        setloading(false);

        alert("Wallet connection error!.");
      }
    } else {
      alert("Please don't use empty values.");
    }
    setloading(false);
  };
  return (
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl my-4 px-6 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl  my-6 text-center font-bold tracking-tight text-gray-900">
            Administration

            <div className="inline-block ml-2">
            <button className=" peer inline-block peer rounded-full border-2 border-gray-400 w-6 h-6 text-sm text-gray-500">
              ?
            </button>
            <div className="absolute peer-hover:inline-flex hidden">
              <p className=" right-48 top-10 w-40 text-gray-300 text-xs mb-5 relative bg-black bg-opacity-90 rounded-xl p-4 m-1 z-10">
              To create a Stream, you need to click in the button "Create
                Stream". Then, you have to provide information about your stream
                like the name, image, and the price for each ticket.
              </p>
            </div>
          </div>
          </h2>

          <div className="flex flex-col">
            <button
              onClick={() => useOpen(true)}
              type="button"
              className="justify-self-center m-auto w-40 rounded-md border border-gray-300 bg-white px-4 py-2 text-md font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Create Stream
            </button>

            <h2 className="text-2xl  my-10 text-center font-bold tracking-tight text-gray-900">
              Buyed Streams
            </h2>
            <div className="flow-root">
              <ul
                role="list"
                className="divide-y divide-gray-200 dark:divide-gray-700"
              >
                {myStreams.map((e, index) => (
                  <li key={index} className="py-3 sm:py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          className="w-16 h-14 rounded-xl"
                          src={e.image}
                          alt={e.name}
                        />
                        <Blockies
                          seed={e.owner}
                          size={8}
                          className="relative border-2 border-gray-400 -mt-4 left-8 rounded-full"
                        ></Blockies>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                          {e.name}
                        </p>
                        <p className="text-sm font-medium text-gray-600 truncate dark:text-white">
                          {moment(e.date).format("MM/DD/yy hh:mm A").toString()}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {e.description}
                        </p>
                        
                      </div>
                      <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        <button
                          onClick={() => getLink(e.id)}
                          className="p-2 shadow-md rounded-full hover:text-gray-600"
                        >
                          <FaLink className="text-2xl" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {open && (
        <div className="flex items-center justify-center fixed left-0 bottom-0 w-full h-full bg-gray-800/50 z-10">
          <div className="bg-white rounded-lg w-1/2">
            <div className="flex flex-col items-start p-4">
              <div className="flex items-center w-full">
                <div className="text-gray-900 font-medium text-lg">
                  Create a new Stream
                </div>
                <svg
                  onClick={() => useOpen(false)}
                  className="ml-auto fill-current text-gray-700 w-6 h-6 cursor-pointer"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 18 18"
                >
                  <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
                </svg>
              </div>
              <hr />
              <div className="w-full grid grid-cols-6 gap-10 my-3 mx-1">
                <div className="col-span-3">
                  <form className="w-full" method="POST">
                    <div className="mb-2">
                      <label
                        htmlFor="name"
                        className="block text-base font-normal text-gray-600"
                      >
                        Stream Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={currentStream.name}
                        onChange={(e) => setInputValue(e)}
                        placeholder="Stream Name"
                        className="w-full rounded-md border border-[#e0e0e0] bg-white p-1 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      />
                    </div>
                    <div className="mb-2">
                      <label
                        htmlFor="image"
                        className="block text-base font-normal text-gray-600"
                      >
                        Image URL
                      </label>
                      <input
                        type="text"
                        name="image"
                        id="name"
                        value={currentStream.image}
                        onChange={(e) => setInputValue(e)}
                        placeholder="Image URL"
                        className="w-full rounded-md border border-[#e0e0e0] bg-white p-1 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      />
                    </div>
                    <div className="mb-2">
                      <label
                        htmlFor="date"
                        className="block text-base font-normal text-gray-600"
                      >
                        Date
                      </label>
                      <input
                        type="datetime-local"
                        name="date"
                        id="name"
                        value={currentStream.date}
                        onChange={(e) => setInputValue(e)}
                        className="w-full rounded-md border border-[#e0e0e0] bg-white p-1 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      />
                    </div>
                    <div className="mb-2">
                      <label
                        htmlFor="link"
                        className="block text-base font-normal text-gray-600"
                      >
                        Stream Link
                      </label>
                      <input
                        type="text"
                        name="link"
                        id="name"
                        value={currentStream.link}
                        onChange={(e) => setInputValue(e)}
                        placeholder="Stream Link"
                        className="w-full rounded-md border border-[#e0e0e0] bg-white p-1 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      />
                    </div>
                    <div className="mb-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="limit_people"
                            className="block text-base font-normal text-gray-600"
                          >
                            Tickets
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            name="limit_people"
                            id="limit_people"
                            value={currentStream.limit_people}
                            onChange={(e) => setInputValue(e)}
                            placeholder="Stream Link"
                            className="w-full rounded-md border border-[#e0e0e0] bg-white p-1 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="price"
                            className="block text-base font-normal text-gray-600"
                          >
                            Price cUSD
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            name="price"
                            id="price"
                            value={currentStream.price}
                            onChange={(e) => setInputValue(e)}
                            placeholder="Stream Link"
                            className="w-full rounded-md border border-[#e0e0e0] bg-white p-1 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-2">
                      <label
                        htmlFor="description"
                        className="block text-base font-normal text-gray-600"
                      >
                        Description
                      </label>
                      <textarea
                        rows="3"
                        name="description"
                        id="message"
                        value={currentStream.description}
                        onChange={(e) => setInputValue(e)}
                        placeholder="Description"
                        className="w-full resize-none rounded-md border border-[#e0e0e0] bg-white py-2 px-2 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      ></textarea>
                    </div>
                    <h2 className="text-xs text-red-500 italic">* There is a 1% fee of the platform.</h2>
                  </form>
                </div>
                <div className="col-span-3">
                  <div key="123" className="group relative">
                    <div className="max-w-md h-full py-4 px-8 bg-white shadow-lg rounded-lg">
                      <img
                        src={currentStream.image}
                        alt={currentStream.name}
                        className="w-full h-60 pb-10"
                      />
                      <div className="flex justify-center md:justify-end -mt-16">
                        <Blockies
                          size={10}
                          className="w-40 h-40 object-cover rounded-full border-2 border-indigo-500"
                          seed={kit?.defaultAccount}
                        ></Blockies>
                      </div>
                      <div>
                        <h2 className="text-gray-800 text-3xl font-semibold">
                          {currentStream.name}
                        </h2>
                        {currentStream.date ? (
                          <h3 className="text-sm text-gray-700">
                            {moment(currentStream.date)
                              .format("MM/DD/yy hh:mm A")
                              .toString()}
                          </h3>
                        ) : (
                          <h3 className="text-sm text-gray-700"> - </h3>
                        )}
                        <p className="mt-2 text-gray-600 h-28 text-ellipsis overflow-y-auto ">
                          {currentStream.description}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 mt-4">
                        <p className="py-2 text-gray-600 text-sm">
                          Tickets {currentStream.limit_people}
                        </p>
                        <button
                          onClick={() => openStream()}
                          className="inline-flex justify-center items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          {currentStream.price} cUSD
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="ml-auto pt-4">
                {loading ? (
                  <button
                    disabled
                    className="bg-gray-300 text-white font-bold py-2 px-4 mr-2 rounded animate-pulse"
                  >
                    Loading...
                  </button>
                ) : (
                  <button
                    onClick={() => createStream()}
                    className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 mr-2 rounded"
                  >
                    Create
                  </button>
                )}
                <button
                  onClick={() => useOpen(false)}
                  className="bg-transparent hover:bg-gray-300 text-cyan-600 font-semibold hover:text-white py-2 px-4 border border-cyan-500 hover:border-transparent rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
