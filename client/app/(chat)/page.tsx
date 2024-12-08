import ContactList from "./_components/ContactList";

const contacts = [
  {
    email: "diyorbeksulaymonov70@gmail.com",
    _id: "1",
  },
  {
    email: "sardor@gmail.com",
    _id: "2",
  },
  {
    email: "alibek@gmail.com",
    _id: "3",
  },
  {
    email: "kamron@gmail.com",
    _id: "4",
  },
];

function Page() {
  return (
    <>
      <div className="w-80 h-screen border-r fixed inset-0 z-50">
        {/* <div className="w-full h-[95vh] flex justify-center items-center">
          <Loader2 size={50} className="animate-spin" />
        </div> */}

        <ContactList contacts={contacts} />
      </div>
    </>
  );
}

export default Page;
